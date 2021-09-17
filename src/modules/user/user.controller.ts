import { Body, Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { User } from '@/modules/user/entities/user.entity';
import { GoogleAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { UserDto } from '@/modules/user/dto/UserDto';
import { Profile } from 'passport-google-oauth20';
import { AppLogger } from '@/common/logger/app.logger';
import { UserService } from '@/modules/user/user.service';
import { Authorization } from '@/constants/constants';
import { CookieInterceptor } from '@/common/interceptor/cookie.interceptor';
import { RedirectInterceptor } from '@/common/interceptor/redirect.interceptor';
import { CookieClearInterceptor } from '@/common/interceptor/cookie.clear.interceptor';
import { Request } from 'express';
import passport from 'passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private logger: AppLogger) {
    this.logger.setContext(UserController.name);
  }

  @Get('google/auth')
  async googleAuth(@Req() req: Request, @Res() res) {
    const { redirect } = req.query;
    passport.authenticate('google', {
      state: Buffer.from(<string>redirect).toString('base64'),
    })(req, res);
  }

  @Get('google/auth/callback')
  @GoogleAuthGuard()
  @UseInterceptors(RedirectInterceptor, CookieInterceptor) // cookie 1st, redirect 2nd
  async googleAuthCallback(@Req() req: Request & { user: Profile }) {
    const profile = req.user;
    // if not register to add user!
    const { state } = req.query;
    const redirect = Buffer.from(<string>state, 'base64').toString();
    const token = await this.userService.googleUserRelation(profile);
    return {
      cookie: [Authorization, token],
      redirect,
    };
  }

  @Post('login')
  @UseInterceptors(CookieInterceptor)
  async login(@Body() user: UserDto) {
    this.logger.info(`${user.email} try to login in!!!`);
    const userInfo = await this.userService.login(user);
    const token = this.userService.generateAuthorization(userInfo);
    return {
      ...userInfo,
      cookie: [Authorization, token],
    };
  }

  @Get('current')
  @JwtAuthGuard()
  async current(@UserFromAuth() user: User) {
    return this.userService.getUserInfo(user.id);
  }

  @Post('logout')
  @UseInterceptors(CookieClearInterceptor)
  logout() {
    return { cookie: Authorization };
  }
}

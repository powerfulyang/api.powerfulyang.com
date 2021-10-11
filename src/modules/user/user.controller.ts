import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import type { Profile } from 'passport-google-oauth20';
import type { Request } from 'express';
import { User } from '@/modules/user/entities/user.entity';
import { GoogleAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { UserDto } from '@/modules/user/dto/UserDto';
import { AppLogger } from '@/common/logger/app.logger';
import { UserService } from '@/modules/user/user.service';
import { Authorization } from '@/constants/constants';
import { CookieInterceptor } from '@/common/interceptor/cookie.interceptor';
import { RedirectInterceptor } from '@/common/interceptor/redirect.interceptor';
import { CookieClearInterceptor } from '@/common/interceptor/cookie.clear.interceptor';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private logger: AppLogger) {
    this.logger.setContext(UserController.name);
  }

  @Get('google/auth')
  @GoogleAuthGuard()
  googleAuth() {}

  @Get('google/auth/callback')
  @GoogleAuthGuard()
  @UseInterceptors(RedirectInterceptor, CookieInterceptor) // cookie 1st, redirect 2nd
  async googleAuthCallback(@Req() req: Request & { user: Profile; query: { state: string } }) {
    const profile = req.user;
    // if not register to add user!
    const { state } = req.query;
    const redirect = Buffer.from(state, 'base64').toString();
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
    return user;
  }

  @Post('logout')
  @UseInterceptors(CookieClearInterceptor)
  logout() {
    return { cookie: Authorization };
  }
}

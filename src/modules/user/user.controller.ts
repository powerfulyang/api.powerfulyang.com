import { Body, Controller, Get, Post, Query, Req, UseInterceptors } from '@nestjs/common';
import { User } from '@/entity/user.entity';
import { GoogleAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { UserDto } from '@/entity/dto/UserDto';
import { Profile } from 'passport-google-oauth20';
import { AppLogger } from '@/common/logger/app.logger';
import { UserService } from '@/modules/user/user.service';
import { Authorization } from '@/constants/constants';
import { CookieInterceptor } from '@/common/interceptor/cookie.interceptor';
import { __dev__ } from '@powerfulyang/utils';
import { stringify } from 'qs';
import { RedirectInterceptor } from '@/common/interceptor/redirect.interceptor';
import { CookieClearInterceptor } from '@/common/interceptor/cookie.clear.interceptor';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private logger: AppLogger) {
    this.logger.setContext(UserController.name);
  }

  @Get('google/auth')
  @GoogleAuthGuard()
  async googleAuth() {
    //
  }

  @Get('google/auth/callback')
  @GoogleAuthGuard()
  @UseInterceptors(RedirectInterceptor, CookieInterceptor) // cookie 1st, redirect 2nd
  async googleAuthCallback(@Req() req: Request & { user: Profile }) {
    const profile = req.user;
    // if not register to add user!
    const token = await this.userService.googleUserRelation(profile);
    return {
      cookie: [Authorization, token],
      redirect: ((__dev__ && 'http://localhost:8000') || 'https://admin.powerfulyang.com').concat(
        `?${stringify({ [Authorization]: token })}`,
      ),
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
  @UseInterceptors(CookieInterceptor)
  current(@UserFromAuth() user: User, @Query(Authorization) token: string) {
    let cookie;
    if (token) {
      cookie = [Authorization, token];
    }
    return Object.assign(this.userService.pickLoginUserInfo(user), { cookie });
  }

  @Post('logout')
  @UseInterceptors(CookieClearInterceptor)
  logout() {
    return { cookie: Authorization };
  }
}

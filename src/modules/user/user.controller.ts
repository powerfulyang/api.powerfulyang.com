import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import type { Profile as GoogleProfile } from 'passport-google-oauth20';
import type { Profile as GithubProfile } from 'passport-github';
import type { Request } from 'express';
import { User } from '@/modules/user/entities/user.entity';
import {
  GithubAuthGuard,
  GoogleAuthGuard,
  JwtAuthGuard,
} from '@/common/decorator/auth-guard.decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { UserLoginDto } from '@/modules/user/dto/user-login.dto';
import { AppLogger } from '@/common/logger/app.logger';
import { UserService } from '@/modules/user/user.service';
import { Authorization } from '@/constants/constants';
import { CookieInterceptor } from '@/common/interceptor/cookie.interceptor';
import { RedirectInterceptor } from '@/common/interceptor/redirect.interceptor';
import { CookieClearInterceptor } from '@/common/interceptor/cookie.clear.interceptor';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private logger: AppLogger) {
    this.logger.setContext(UserController.name);
  }

  @Get('google/auth')
  @GoogleAuthGuard()
  googleAuth() {
    this.logger.info('Google Auth try!');
  }

  @Get('github/auth')
  @GithubAuthGuard()
  githubAuth() {
    this.logger.info('Github Auth try!');
  }

  @Get('google/auth/callback')
  @GoogleAuthGuard()
  @UseInterceptors(RedirectInterceptor, CookieInterceptor) // cookie 1st, redirect 2nd
  async googleAuthCallback(
    @Req() req: Request & { user: GoogleProfile; query: { state: string } },
  ) {
    const profile = req.user;
    // if not register to add user!
    const { state } = req.query;
    const redirect = Buffer.from(state, 'base64').toString();
    const token = await this.userService.dealLoginRequestFromOauthApplication(
      profile,
      SupportOauthApplication.google,
    );
    return {
      cookie: [Authorization, token],
      redirect,
    };
  }

  @Get('github/auth/callback')
  @GithubAuthGuard()
  @UseInterceptors(RedirectInterceptor, CookieInterceptor) // cookie 1st, redirect 2nd
  async githubAuthCallback(
    @Req() req: Request & { user: GithubProfile; query: { state: string } },
  ) {
    const profile = req.user;
    // if not register to add user!
    const { state } = req.query;
    const redirect = Buffer.from(state, 'base64').toString();
    const token = await this.userService.dealLoginRequestFromOauthApplication(
      profile,
      SupportOauthApplication.github,
    );
    return {
      cookie: [Authorization, token],
      redirect,
    };
  }

  @Post('login')
  @UseInterceptors(CookieInterceptor)
  async login(@Body() user: UserLoginDto) {
    this.logger.info(`${user.email} try to login in!!!`);
    const token = await this.userService.login(user);
    return {
      cookie: [Authorization, token],
    };
  }

  @Get('current')
  @JwtAuthGuard()
  async current(@UserFromAuth() user: User) {
    this.logger.info(`${user.email} try to get current user info!!!`);
    return user;
  }

  @Post('logout')
  @JwtAuthGuard()
  @UseInterceptors(CookieClearInterceptor)
  logout(@UserFromAuth() user: User) {
    this.logger.info(`${user.email} try to logout!!!`);
    return { cookie: Authorization };
  }
}

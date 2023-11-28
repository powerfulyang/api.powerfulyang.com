import { LoginInterceptor } from '@/common/interceptor/login.interceptor';
import { Body, Controller, Get, HttpStatus, Post, Req, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Profile as GithubProfile } from 'passport-github';
import type { Profile as GoogleProfile } from 'passport-google-oauth20';
import {
  GithubAuthGuard,
  GoogleAuthGuard,
  JwtAuthGuard,
  PublicAuthGuard,
} from '@/common/decorator/auth-guard.decorator';
import { AuthUser } from '@/common/decorator/user-from-auth.decorator';
import type { CookieClear } from '@/common/interceptor/cookie.interceptor';
import { CookieInterceptor } from '@/common/interceptor/cookie.interceptor';
import { RedirectInterceptor } from '@/common/interceptor/redirect.interceptor';
import { LoggerService } from '@/common/logger/logger.service';
import { Authorization, DefaultCookieOptions } from '@/constants/constants';

import { SupportOauthApplication } from '@/oauth-application/entities/support-oauth.application';
import { UserLoginDto } from '@/user/dto/user-login.dto';
import { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private userService: UserService,
    private logger: LoggerService,
  ) {
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
  @UseInterceptors(RedirectInterceptor, LoginInterceptor, CookieInterceptor) // cookie 1st, redirect 2nd
  async googleAuthCallback(@Req() req: { user: GoogleProfile; query: { state: string } }) {
    const profile = req.user;
    // if not register to add user!
    const { state } = req.query;
    const redirect = Buffer.from(state, 'base64').toString();
    const { user, token } = await this.userService.dealLoginRequestFromOauthApplication(
      profile,
      SupportOauthApplication.google,
    );
    return {
      cookies: [
        {
          name: Authorization,
          value: token,
        },
      ],
      redirect: {
        url: redirect,
        type: 'JS',
      },
      user,
    };
  }

  @Get('github/auth/callback')
  @GithubAuthGuard()
  @UseInterceptors(RedirectInterceptor, LoginInterceptor, CookieInterceptor) // cookie 1st, redirect 2nd
  async githubAuthCallback(@Req() req: { user: GithubProfile; query: { state: string } }) {
    const profile = req.user;
    // if not register to add user!
    const { state } = req.query;
    const redirect = Buffer.from(state, 'base64').toString();
    const { token, user } = await this.userService.dealLoginRequestFromOauthApplication(
      profile,
      SupportOauthApplication.github,
    );
    return {
      cookies: [
        {
          name: Authorization,
          value: token,
        },
      ],
      redirect: {
        url: redirect,
        type: 'JS',
      },
      user,
    };
  }

  @Post('login')
  @UseInterceptors(LoginInterceptor, CookieInterceptor)
  @ApiOperation({
    summary: '使用用户名密码登录',
    operationId: 'loginWithEmail',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    headers: {
      'set-cookie': {
        schema: {
          type: 'string',
          example:
            'Authorization=auth-token; Path=/; HttpOnly; Max-Age=3600; SameSite=Lax; Secure; Domain=example.com; ',
        },
      },
    },
  })
  async login(@Body() _user: UserLoginDto) {
    const { user, token } = await this.userService.login(_user);
    return {
      cookies: [
        {
          name: Authorization,
          value: token,
        },
      ],
      ...user,
      user,
    };
  }

  @Get('current')
  @PublicAuthGuard()
  @ApiOperation({
    summary: '获取当前登录用户信息',
    operationId: 'queryCurrentUser',
  })
  @ApiOkResponse({
    type: User,
    description: '当前登录用户信息',
  })
  current(@AuthUser() user: User) {
    if (user.email) {
      this.logger.verbose(`${user.email} try to get current user info`);
      return user;
    }
    return null;
  }

  @Post('logout')
  @JwtAuthGuard()
  @UseInterceptors(CookieInterceptor)
  @ApiOperation({
    summary: '登出',
    operationId: 'logout',
  })
  logout(@AuthUser() user: User): { cookies: CookieClear[] } {
    this.logger.info(`${user.email} try to logout!!!`);
    return {
      cookies: [
        {
          name: Authorization,
          options: {
            ...DefaultCookieOptions,
            maxAge: 0,
          },
        },
      ],
    };
  }

  @Get('menus')
  @JwtAuthGuard()
  @ApiOperation({
    summary: '获取当前用户的菜单',
    operationId: 'queryCurrentUserMenus',
  })
  queryCurrentUserMenus(@AuthUser() user: User) {
    return this.userService.queryMenusByUserId(user.id);
  }
}

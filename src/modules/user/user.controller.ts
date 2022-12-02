import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import type { Profile as GoogleProfile } from 'passport-google-oauth20';
import type { Profile as GithubProfile } from 'passport-github';
import type { FastifyRequest } from 'fastify';
import { User } from '@/modules/user/entities/user.entity';
import {
  GithubAuthGuard,
  GoogleAuthGuard,
  JwtAuthGuard,
  PublicAuthGuard,
} from '@/common/decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { UserLoginDto } from '@/modules/user/dto/user-login.dto';
import { LoggerService } from '@/common/logger/logger.service';
import { UserService } from '@/modules/user/user.service';
import { Authorization, DefaultCookieOptions } from '@/constants/constants';
import type { CookieClear } from '@/common/interceptor/cookie.interceptor';
import { CookieInterceptor } from '@/common/interceptor/cookie.interceptor';
import { RedirectInterceptor } from '@/common/interceptor/redirect.interceptor';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOkInterceptorResultResponse } from '@/common/swagger/ResponseInterceptorResult';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService, private logger: LoggerService) {
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
    @Req() req: FastifyRequest & { user: GoogleProfile; query: { state: string } },
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
    };
  }

  @Get('github/auth/callback')
  @GithubAuthGuard()
  @UseInterceptors(RedirectInterceptor, CookieInterceptor) // cookie 1st, redirect 2nd
  async githubAuthCallback(
    @Req() req: FastifyRequest & { user: GithubProfile; query: { state: string } },
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
    };
  }

  @Post('login')
  @UseInterceptors(CookieInterceptor)
  @ApiOperation({ summary: '使用用户名密码登录' })
  @ApiResponse({
    status: 200,
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
  async login(@Body() user: UserLoginDto) {
    this.logger.info(`${user.email} try to login in`);
    const token = await this.userService.login(user);
    return {
      cookies: [
        {
          name: Authorization,
          value: token,
        },
      ],
    };
  }

  @Get('current')
  @PublicAuthGuard()
  @ApiOperation({ summary: '获取当前登录用户信息' })
  @ApiOkInterceptorResultResponse({
    model: User,
  })
  @ApiCookieAuth()
  current(@UserFromAuth() user: User) {
    this.logger.info(`${user.email} try to get current user info`);
    return user;
  }

  @Post('logout')
  @JwtAuthGuard()
  @UseInterceptors(CookieInterceptor)
  logout(@UserFromAuth() user: User): { cookies: CookieClear[] } {
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
}

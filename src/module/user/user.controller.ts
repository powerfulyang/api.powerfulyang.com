import {
    Body,
    Controller,
    Get,
    Post,
    Redirect,
    Req,
    Res,
} from '@nestjs/common';
import { User } from '@/entity/user.entity';
import {
    GoogleAuthGuard,
    JwtAuthGuard,
} from '@/common/decorator/auth-guard.decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { UserDto } from '@/entity/dto/UserDto';
import { Profile } from 'passport-google-oauth20';
import { AppLogger } from '@/common/logger/app.logger';
import { UserService } from '@/module/user/user.service';
import { Response } from 'express';
import { Authorization } from '@/constants/constants';
import { pick } from 'ramda';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private logger: AppLogger,
    ) {
        this.logger.setContext(UserController.name);
    }

    @Get('google/auth')
    @GoogleAuthGuard()
    async googleAuth() {
        //
    }

    @Get('google/auth/callback')
    @GoogleAuthGuard()
    @Redirect()
    async googleAuthCallback(
        @Req() req: Request & { user: Profile },
        @Res() res: Response,
    ) {
        const profile = req.user;
        // if not register to add user!
        const token = await this.userService.googleUserRelation(
            profile,
        );
        res.cookie(Authorization, token);
        return { url: 'https://dev.powerfulyang.com/user/current' };
    }

    @Post('login')
    @Redirect()
    async login(@Body() user: UserDto, @Res() res: Response) {
        this.logger.info(`${user.email} try to login in!!!`);
        const token = this.userService.generateAuthorization(user);
        res.cookie(Authorization, token);
        return { url: 'https://dev.powerfulyang.com/user/current' };
    }

    @Get('current')
    @JwtAuthGuard()
    current(@UserFromAuth() user: User) {
        return pick(['id', 'nickname', 'email'])(user);
    }
}

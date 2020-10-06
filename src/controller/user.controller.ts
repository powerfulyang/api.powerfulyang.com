import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Logger,
    Post,
    Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/entity/user.entity';
import {
    GoogleAuthGuard,
    JwtAuthGuard,
} from '@/common/decorator/auth-guard';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { sha1 } from '@powerfulyang/node-utils';
import { UserDto } from '@/entity/dto/UserDto';
import { Profile } from 'passport-google-oauth20';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        @InjectRepository(User) private userDao: Repository<User>,
        private jwtService: JwtService,
    ) {}

    @Get('google/auth')
    @GoogleAuthGuard()
    async googleAuth() {}

    @Get('google/auth/callback')
    @GoogleAuthGuard()
    async googleAuthCallback(@Request() req: { user: Profile }) {
        this.logger.debug(req.user.id);
    }

    @Post('login')
    async login(@Body() user: UserDto) {
        const { email, password } = user;
        const userInfo = await this.userDao.findOneOrFail({
            email,
        });
        const passwordSalt = sha1(password, userInfo.salt);
        if (passwordSalt !== userInfo.passwordSalt) {
            throw new ForbiddenException();
        }
        const token = this.jwtService.sign({ ...userInfo });
        return { setToken: token };
    }

    @Get('current')
    @JwtAuthGuard()
    current(@UserFromAuth() user: User) {
        return this.userDao.findOne(user);
    }
}

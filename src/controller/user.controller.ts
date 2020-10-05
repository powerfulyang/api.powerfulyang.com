import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/entity/user.entity';
import { JwtAuthGuard } from '@/common/authorization/JwtAuthGuard';

@Controller('user')
export class UserController {
    constructor(
        @InjectRepository(User) private userDao: Repository<User>,
        private jwtService: JwtService,
    ) {}

    @Post('login')
    async login(@Body() user: User) {
        const { email, password } = user;
        const userInfo = await this.userDao.findOneOrFail({
            email,
            password,
        });
        const token = this.jwtService.sign({ ...userInfo });
        return { setToken: token };
    }

    @Get('current')
    @UseGuards(JwtAuthGuard)
    current() {
        return this.userDao.findOne();
    }
}

import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
    constructor(
        @InjectRepository(User) private userDao: Repository<User>,
        private jwtService: JwtService,
    ) {}

    @Post('login')
    async login(@Body() user: User) {
        const { email, password } = user;
        user = await this.userDao.findOneOrFail({ email, password });
        const token = this.jwtService.sign({ ...user });
        return { setToken: token };
    }
}

import { User } from '@/entity/user.entity';
import { IsEmail } from 'class-validator';

export class UserDto extends User {
    @IsEmail()
    email: string;
}

import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column()
    passwordSalt!: string;

    @Column()
    password!: string;

    @Column()
    nickname: string;

    @Column()
    avatar: string;

    @CreateDateColumn()
    createAt!: Date;

    @UpdateDateColumn()
    updateAt!: Date;

    @Column({ unique: true })
    googleOpenId: string;
}

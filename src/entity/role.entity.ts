import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Menu } from '@/entity/menu.entity';
import { User } from '@/entity/user.entity';

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roleName: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToMany(() => Menu)
    @JoinTable()
    menus: Menu[];

    @OneToOne(() => User)
    user: User;
}

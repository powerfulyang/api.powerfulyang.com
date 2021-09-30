import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Menu } from '@/modules/user/entities/menu.entity';

@Entity('role')
export class Role {
  static IntendedRoles = {
    default: 'Default Role',
    admin: 'Admin Role',
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roleName: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToMany(() => Menu, { eager: true })
  @JoinTable()
  menus: Menu[];
}

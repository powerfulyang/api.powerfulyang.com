import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Menu } from '@/modules/user/entities/menu.entity.mjs';

@Entity('role')
export class Role {
  static IntendedRoles = {
    admin: 'Admin Role',
    default: 'Default Role',
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

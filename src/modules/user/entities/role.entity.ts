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
import { ApiProperty } from '@nestjs/swagger';

@Entity('role')
export class Role {
  static IntendedRoles = {
    admin: 'Admin Role',
    default: 'Default Role',
  };

  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  roleName: string;

  @CreateDateColumn()
  @ApiProperty()
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updateAt: Date;

  @ManyToMany(() => Menu, { eager: true })
  @JoinTable()
  @ApiProperty({
    type: [Menu],
    description: '菜单列表',
  })
  menus: Menu[];
}

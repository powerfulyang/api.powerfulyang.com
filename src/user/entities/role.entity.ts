import type { Permission } from '@/common/decorator/permissions.decorator';
import { Menu } from '@/user/entities/menu.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  updatedAt: Date;

  @ManyToMany(() => Menu)
  @JoinTable()
  @ApiProperty({
    type: [Menu],
    description: '菜单列表',
  })
  menus: Menu[];

  @Column({ type: 'jsonb', default: [] })
  @ApiProperty({
    description: '权限列表',
    type: [String],
  })
  permissions: Permission[];
}

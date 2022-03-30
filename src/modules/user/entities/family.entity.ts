import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { UserOmitRelations } from '@/modules/user/entities/user.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity()
export class Family {
  constructor(name: string) {
    this.name = name;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  description: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToMany(() => User, (user) => user.families)
  members: UserOmitRelations[];
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/entity/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  info: string;

  @JoinColumn()
  @ManyToOne(() => User)
  createBy: User;

  @JoinColumn()
  @ManyToOne(() => User)
  updateBy: User;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  deadline: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

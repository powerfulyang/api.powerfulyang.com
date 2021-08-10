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
  id?: number;

  @Column()
  info: string;

  @Column({
    default: '',
  })
  desc?: string;

  @JoinColumn()
  @ManyToOne(() => User)
  createBy: User;

  static readonly relationColumnCreateBy = 'createBy';

  @JoinColumn()
  @ManyToOne(() => User)
  updateBy: User;

  static readonly relationColumnUpdateBy = 'updateBy';

  @CreateDateColumn()
  createAt?: Date;

  @Column()
  deadline?: Date;

  @UpdateDateColumn()
  updateAt?: Date;
}

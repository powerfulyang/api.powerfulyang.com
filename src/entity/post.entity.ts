import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/entity/user.entity';

@Entity('post')
@Index(['title', 'createBy'], { unique: true })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ default: true })
  public: boolean;

  @JoinColumn()
  @ManyToOne(() => User)
  createBy: User;

  static RelationColumnCreateBy = 'createBy';

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

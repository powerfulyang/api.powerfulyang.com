import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '@/modules/post/entities/post.entity';

@Entity()
export class PostLog {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  post: Relation<Post>;

  @Column()
  title: string;

  @Column({ type: 'text', unique: true })
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

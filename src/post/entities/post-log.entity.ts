import { Post } from '@/post/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';
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

@Entity()
export class PostLog {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  @ApiProperty({
    type: () => Post,
  })
  post: Relation<Post>;

  @Column()
  @ApiProperty()
  title: string;

  @Column({ type: 'text' })
  @ApiProperty()
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  updatedAt: Date;
}

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PostLog } from '@/modules/post/entities/post.log.entity';

@Entity('post')
@Index(['title', 'createBy'], { unique: true })
export class Post {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'post id',
  })
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: '' })
  summary: string;

  @Column({ type: 'json' })
  tags: string[];

  @Column({ default: false })
  public: boolean;

  @Column()
  publishYear: number;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createBy: User;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updateBy: User;

  @JoinColumn()
  @ManyToOne(() => Asset, { eager: true })
  poster: Asset;

  @OneToMany(() => PostLog, (log) => log.post)
  logs: PostLog[];

  @CreateDateColumn({ type: 'timestamptz' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  @BeforeInsert()
  beforeInsert() {
    if (!this.publishYear) {
      this.publishYear = new Date().getFullYear();
    }
    if (!this.tags?.length) {
      this.tags = ['这个人居然不写标签'];
    }
  }
}

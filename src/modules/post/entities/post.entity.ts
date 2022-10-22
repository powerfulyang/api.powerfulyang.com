import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { pinyin } from '@napi-rs/pinyin';

@Entity('post')
@Index(['title', 'createBy'], { unique: true })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  urlTitle: string;

  @Column({ type: 'text' })
  content: string;

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

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  static generateUrlTitle(post: Post) {
    return pinyin(post.title).join('-').replaceAll(' ', '-').concat(`-${post.createBy.id}`);
  }

  @BeforeInsert()
  beforeInsert() {
    if (!this.publishYear) {
      this.publishYear = new Date().getFullYear();
    }
    if (!this.tags?.length) {
      this.tags = ['这个人居然不写标签'];
    }
    if (this.title && this.createBy) {
      this.urlTitle = Post.generateUrlTitle(this);
    }
  }
}

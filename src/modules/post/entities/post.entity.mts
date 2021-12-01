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
import { User } from '@/modules/user/entities/user.entity.mjs';
import { Asset } from '@/modules/asset/entities/asset.entity.mjs';

@Entity('post')
@Index(['title', 'createBy'], { unique: true })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json' })
  tags: string[];

  @Column({ default: true })
  public: boolean;

  @Column()
  publishYear: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, eager: true })
  createBy: User;

  @JoinColumn()
  @ManyToOne(() => Asset, { eager: true })
  poster: Asset;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  beforeInsert() {
    if (!this.publishYear) {
      this.publishYear = String(new Date().getFullYear());
    }
    if (!this.tags?.length) {
      this.tags = ['这个人居然不写标签'];
    }
  }
}

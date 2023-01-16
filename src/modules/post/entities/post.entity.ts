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
import { ApiProperty } from '@nestjs/swagger';

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

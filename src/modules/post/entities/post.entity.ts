import { Asset } from '@/modules/asset/entities/asset.entity';
import { PostLog } from '@/modules/post/entities/post-log.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
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

@Entity('post')
@Index(['title', 'createBy'], { unique: true })
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column({ type: 'text' })
  @Field()
  content: string;

  @Column({ default: '' })
  @Field()
  summary: string;

  @Column({ type: 'json' })
  @Field(() => [String])
  tags: string[];

  @Column({ default: false })
  @Field()
  public: boolean;

  @Column()
  @Field()
  publishYear: number;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  @Field(() => User)
  createBy: User;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updateBy: User;

  @JoinColumn()
  @ManyToOne(() => Asset)
  poster: Asset;

  @OneToMany(() => PostLog, (log) => log.post)
  logs: PostLog[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  protected beforeInsert() {
    if (!this.publishYear) {
      this.publishYear = new Date().getFullYear();
    }
    if (!this.tags?.length) {
      this.tags = ['这个人居然不写标签'];
    }
  }
}

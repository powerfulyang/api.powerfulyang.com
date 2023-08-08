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
import { Asset } from '@/asset/entities/asset.entity';
import { PostLog } from '@/post/entities/post-log.entity';
import { User } from '@/user/entities/user.entity';

@Entity('post')
@Index(['title', 'createBy'], { unique: true })
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  @ApiProperty()
  id: number;

  @Column()
  @Field()
  @ApiProperty()
  title: string;

  @Column({ type: 'text' })
  @Field()
  @ApiProperty()
  content: string;

  @Column({ default: '' })
  @Field()
  @ApiProperty()
  summary: string;

  @Column({ type: 'json' })
  @Field(() => [String])
  @ApiProperty()
  tags: string[];

  @Column({ default: false })
  @Field()
  @ApiProperty()
  public: boolean;

  @Column()
  @Field()
  @ApiProperty()
  publishYear: number;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  @Field(() => User)
  @ApiProperty({
    type: () => User,
  })
  createBy: User;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @ApiProperty({
    type: () => User,
  })
  updateBy: User;

  @JoinColumn()
  @ManyToOne(() => Asset)
  @ApiProperty({
    type: () => Asset,
  })
  poster: Asset;

  @OneToMany(() => PostLog, (log) => log.post)
  @ApiProperty({
    type: () => [PostLog],
  })
  logs: PostLog[];

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
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

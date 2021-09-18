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

@Entity('post')
@Index(['title', 'createBy'], { unique: true })
export class Post {
  static RelationColumnCreateBy = 'createBy';

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

  @Column()
  publishYear: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createBy: User;

  @JoinColumn()
  @ManyToOne(() => Asset)
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

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { User, UserOmitOauthOpenidArr } from '@/modules/user/entities/user.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToMany(() => Asset, { onDelete: 'CASCADE', eager: true })
  @JoinTable()
  assets: Asset[];

  @Column({ default: true })
  public: boolean;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, eager: true })
  createBy: UserOmitOauthOpenidArr;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

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
import { User } from '@/modules/user/entities/user.entity';

@Entity()
export class Feed {
  static readonly relationColumnAssets = 'assets';

  static readonly relationColumnCreateBy = 'createBy';

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  content: string;

  @ManyToMany(() => Asset, { onDelete: 'CASCADE' })
  @JoinTable()
  assets?: Asset[];

  @Column({ default: true })
  public: boolean;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createBy: User;

  @CreateDateColumn()
  createAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;
}

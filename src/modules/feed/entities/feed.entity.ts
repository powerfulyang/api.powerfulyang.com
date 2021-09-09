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
import { Asset } from '@/entity/asset.entity';
import { User } from '@/entity/user.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  content: string;

  @ManyToMany(() => Asset, { onDelete: 'CASCADE' })
  @JoinTable()
  assets?: Asset[];

  @Column({ default: true })
  public: boolean;

  static readonly relationColumnAssets = 'assets';

  @JoinColumn()
  @ManyToOne(() => User)
  createBy: User;

  static readonly relationColumnCreateBy = 'createBy';

  @CreateDateColumn()
  createAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;
}

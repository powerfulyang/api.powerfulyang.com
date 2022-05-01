import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { CORSRule } from 'cos-nodejs-sdk-v5';
import { BucketACL, RefererConfiguration } from 'cos-nodejs-sdk-v5';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { TencentCloudAccount } from '@/modules/tencent-cloud-account/entities/tencent-cloud-account.entity';

export enum BuiltinBucket {
  timeline = 'timeline',
}

@Entity()
export class CosBucket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  Bucket: string;

  @Column()
  Region: string;

  @Column()
  ACL: BucketACL;

  @Column({ type: 'json' })
  CORSRules: CORSRule[];

  @Column({ type: 'json' })
  RefererConfiguration: RefererConfiguration;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @JoinColumn()
  @ManyToOne(() => TencentCloudAccount, { eager: true, nullable: false })
  tencentCloudAccount: Partial<TencentCloudAccount> & Pick<TencentCloudAccount, 'id'>;

  @OneToMany(() => Asset, (asset) => asset.bucket)
  assets: Asset[];

  @Column({ default: false })
  public: boolean;
}

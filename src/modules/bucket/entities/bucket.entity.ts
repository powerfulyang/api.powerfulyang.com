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
import { ApiProperty } from '@nestjs/swagger';
import { TEST_BUCKET_ONLY } from '@/utils/env';

export enum BuiltinBucket {
  timeline = 'timeline',
}

@Entity()
export class CosBucket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @ApiProperty({ default: TEST_BUCKET_ONLY, description: 'bucket 在系统中的名称' })
  name: string;

  @Column({ unique: true })
  Bucket: string;

  @Column()
  Region: string;

  @Column({ type: 'varchar' })
  ACL: BucketACL;

  @Column({ type: 'json' })
  CORSRules: CORSRule[];

  @Column({ type: 'json' })
  RefererConfiguration: RefererConfiguration;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @JoinColumn()
  @ManyToOne(() => TencentCloudAccount, { nullable: false })
  tencentCloudAccount: Partial<TencentCloudAccount> & Pick<TencentCloudAccount, 'id'>;

  @OneToMany(() => Asset, (asset) => asset.bucket)
  assets: Asset[];

  @Column({ default: false })
  public: boolean;
}

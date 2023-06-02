import { Asset } from '@/asset/entities/asset.entity';
import { TencentCloudAccount } from '@/tencent-cloud-account/entities/tencent-cloud-account.entity';
import { TEST_BUCKET_ONLY } from '@/utils/env';
import { ApiProperty } from '@nestjs/swagger';
import type { CORSRule } from 'cos-nodejs-sdk-v5';
import { BucketACL, RefererConfiguration } from 'cos-nodejs-sdk-v5';
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

export enum BuiltinBucket {
  timeline = 'timeline',
}

@Entity()
export class CosBucket {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty({ default: TEST_BUCKET_ONLY, description: 'bucket 在系统中的名称' })
  name: string;

  @Column({ unique: true })
  @ApiProperty()
  Bucket: string;

  @Column()
  @ApiProperty()
  Region: string;

  @Column({ type: 'varchar' })
  @ApiProperty()
  ACL: BucketACL;

  @Column({ type: 'json' })
  @ApiProperty()
  CORSRules: CORSRule[];

  @Column({ type: 'json' })
  @ApiProperty()
  RefererConfiguration: RefererConfiguration;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  updatedAt: Date;

  @JoinColumn()
  @ManyToOne(() => TencentCloudAccount, { nullable: false })
  @ApiProperty({
    type: () => TencentCloudAccount,
  })
  tencentCloudAccount: Partial<TencentCloudAccount> & Pick<TencentCloudAccount, 'id'>;

  @OneToMany(() => Asset, (asset) => asset.bucket)
  @ApiProperty({
    type: () => [Asset],
  })
  assets: Asset[];

  @Column({ default: false })
  @ApiProperty()
  public: boolean;
}

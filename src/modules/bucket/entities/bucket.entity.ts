import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { GetBucketCorsData, GetBucketRefererData } from 'cos-nodejs-sdk-v5';
import { BucketRegion } from 'api/tencent-cloud-cos/cos-nodejs-sdk-v5';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { AssetBucket } from '@/enum/AssetBucket';

@Entity('bucket')
@Index(['bucketName', 'bucketRegion'], { unique: true })
export class Bucket {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Asset, (asset) => asset.bucket)
  assets!: Asset[];

  @Column({ unique: true })
  bucketName!: AssetBucket;

  @Column()
  bucketRegion!: BucketRegion;

  @Column({ default: true })
  public: boolean;

  acl: string;

  cors: Pick<GetBucketCorsData, 'CORSRules'>;

  referer: Pick<GetBucketRefererData, 'RefererConfiguration'>;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

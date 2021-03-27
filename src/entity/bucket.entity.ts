import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asset } from '@/entity/asset.entity';
import { GetBucketCorsData, GetBucketRefererData } from 'cos-nodejs-sdk-v5';
import { BucketRegion } from 'api/tencent-cloud-cos/cos-nodejs-sdk-v5';
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

  acl: string;

  cors: Pick<GetBucketCorsData, 'CORSRules'>;

  referer: Pick<GetBucketRefererData, 'RefererConfiguration'>;

  @Column({ type: 'json' })
  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

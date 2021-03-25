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
import { BucketRegion, GetBucketCorsData, GetBucketRefererData } from 'cos-nodejs-sdk-v5';

@Entity('bucket')
@Index(['bucketName', 'bucketRegion'], { unique: true })
export class Bucket {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Asset, (asset) => asset.bucket)
  assets!: Asset[];

  @Column({ unique: true })
  bucketName!: string;

  @Column()
  bucketRegion!: BucketRegion;

  @Column()
  acl: string;

  @Column({ type: 'json' })
  cors: Pick<GetBucketCorsData, 'CORSRules'>;

  @Column({ type: 'json' })
  referer: Pick<GetBucketRefererData, 'RefererConfiguration'>;

  @Column({ type: 'json' })
  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

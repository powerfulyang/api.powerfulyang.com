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
import { BucketRegion } from 'cos-nodejs-sdk-v5';
import {
    GetBucketCorsData,
    GetBucketRefererData,
} from 'api/tencent-cloud-cos/type';

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

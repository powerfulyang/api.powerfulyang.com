import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Asset } from '@/entity/asset.entity';
import { BucketRegion } from 'cos-nodejs-sdk-v5';

@Entity('bucket')
@Index(['bucketName', 'bucketRegion'])
export class Bucket {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => Asset, (asset) => asset.bucket)
    assets!: Asset[];

    @Column({ unique: true })
    bucketName!: string;

    @Column()
    bucketRegion!: BucketRegion;
}

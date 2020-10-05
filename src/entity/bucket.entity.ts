import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Asset } from '@/entity/asset.entity';

@Entity('bucket')
export class Bucket {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => Asset, (asset) => asset.bucket)
    assets!: Asset[];

    @Column({ unique: true })
    bucketName!: string;

    @Column()
    bucketRegion!: string;

    @Column()
    bucketRegionUrl!: string;
}

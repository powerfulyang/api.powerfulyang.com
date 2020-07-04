import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BucketRegion } from '../enum/Bucket';
import { StaticResource } from './static.entity';

@Entity('bucket')
export class Bucket {
    @PrimaryGeneratedColumn()
    bucketId!: number;

    @OneToMany(() => StaticResource, (staticResource) => staticResource.bucket)
    staticList!: StaticResource[];

    @Column({ unique: true })
    bucketName!: string;

    @Column()
    bucketRegion!: BucketRegion;

    @Column()
    SecretId!: string;

    @Column()
    SecretKey!: string;
}

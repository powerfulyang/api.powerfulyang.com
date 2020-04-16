import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BucketRegion } from '../enum/Bucket';
import { Static } from './static.entity';

@Entity('bucket')
export class Bucket {
  @PrimaryGeneratedColumn({ name: 'bucket_id' })
  bucketId: number;

  @Column({ name: 'bucket_name', unique: true })
  bucketName: string;

  @Column({ name: 'bucket_region' })
  bucketRegion: BucketRegion;

  @OneToMany(() => Static, (staticEntity) => staticEntity.bucket)
  staticList: Static[];

  @Column({ name: 'is_default' })
  isDefault: boolean;
}

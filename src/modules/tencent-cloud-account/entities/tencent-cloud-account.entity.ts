import { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TencentCloudAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ select: false })
  SecretId: string;

  @Column({ select: false })
  SecretKey: string;

  @Column({ unique: true, select: false })
  AppId: string;

  @OneToMany(() => CosBucket, (bucket) => bucket.tencentCloudAccount)
  buckets: CosBucket[];
}

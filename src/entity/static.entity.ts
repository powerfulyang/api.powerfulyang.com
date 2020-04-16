import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bucket } from './bucket.entity';

@Entity('static_resource')
export class Static {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'bucket_id' })
  @ManyToOne(() => Bucket, (bucket) => bucket.staticList)
  bucket: Bucket;

  @Column({ name: 'bucket_id' })
  bucketId: number;

  @Column()
  filename: string;

  @Column({ name: 'project_name' })
  projectName: string;

  @Column()
  folder: string;

  @Column()
  comment: string;

  @Column({ name: 'file_path', unique: true })
  filePath: string;

  @Column({ name: 'min_file_path' })
  minFilePath: string;

  @Column({ name: 'webp_file_path' })
  webpFilePath: string;

  @Column({ name: 'access_url' })
  accessUrl: string;

  @Column({ name: 'min_access_url' })
  minAccessUrl: string;

  @Column({ name: 'webp_access_url' })
  webpAccessUrl: string;

  @Column({ name: 'upload_date' })
  uploadDate: string;

  @Column({ name: 'dir_path' })
  dirPath: string;

  @Column({ name: 'min_dir_path' })
  minDirPath: string;

  @Column({ name: 'webp_dir_path' })
  webpDirPath: string;

  @Column()
  sha1: string;
}

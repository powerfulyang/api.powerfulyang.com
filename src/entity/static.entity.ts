import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bucket } from './bucket.entity';

@Entity('static_resource')
export class Static {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToMany(() => Bucket, { nullable: false })
  bucket: Bucket;

  @Column()
  filename: string;

  @Column({ name: 'project_name' })
  projectName: string;

  @Column()
  folder: string;

  @Column()
  comment: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'min_file_path' })
  minFilePath: string;

  @Column({ name: 'access_url' })
  accessUrl: string;

  @Column({ name: 'min_access_url' })
  minAccessUrl: string;
}

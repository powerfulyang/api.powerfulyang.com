import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Metadata } from 'sharp';
import { Bucket } from '../../bucket/entities/bucket.entity';

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Bucket)
  bucket: Bucket;

  @Column({ default: '' })
  cosUrl: string;

  @Column({ default: '', length: 400 })
  objectUrl: string;

  @Column({ default: '' })
  originUrl: string;

  @Column({ default: '' })
  sn: string;

  @Column({ type: 'json' })
  tags: string[] = [];

  @Column({ default: '' })
  comment: string;

  @Column()
  fileSuffix: string;

  @Column({ unique: true })
  sha1: string;

  @Column()
  pHash: string;

  @Column({ type: 'json' })
  exif: object;

  @Column({ type: 'json' })
  metadata: Metadata;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

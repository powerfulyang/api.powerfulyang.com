import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Metadata } from 'sharp';
import { pick } from 'ramda';
import { User } from '@/modules/user/entities/user.entity';
import { Bucket } from '../../bucket/entities/bucket.entity';
import { Exif } from '../../../../addon.api/types/Exif';

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Bucket, { nullable: false })
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

  @Column({ type: 'json', select: false })
  exif: Exif;

  @Column({ type: 'json', select: false })
  metadata: Metadata;

  @Column({ type: 'json' })
  size: Pick<Metadata, 'width' | 'height'>;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  uploadBy: User;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  beforeInsert() {
    if (this.metadata) {
      this.size = pick(['width', 'height'])(this.metadata);
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    if (this.metadata) {
      this.size = pick(['width', 'height'])(this.metadata);
    }
  }
}

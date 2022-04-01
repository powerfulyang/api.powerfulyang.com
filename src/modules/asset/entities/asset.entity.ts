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
import { User, UserForeignKey } from '@/modules/user/entities/user.entity';
import { CosBucket } from '../../bucket/entities/bucket.entity';
import { Exif } from '../../../../addon.api/types/Exif';

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => CosBucket, { nullable: false, eager: true })
  bucket: CosBucket;

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

  /**
   * 需要注意，这里的值是不带 `.` 的
   */
  @Column()
  fileSuffix: string;

  @Column({ unique: true })
  sha1: string;

  @Column()
  pHash: string;

  @Column({ type: 'jsonb', select: false })
  exif: Exif;

  @Column({ type: 'jsonb', select: false })
  metadata: Metadata;

  @Column({ type: 'json' })
  size: Pick<Metadata, 'width' | 'height'>;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  uploadBy: UserForeignKey;

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

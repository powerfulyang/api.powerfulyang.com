import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Metadata } from 'sharp';
import { pick } from 'ramda';
import { User } from '@/modules/user/entities/user.entity';
import { CosBucket } from '../../bucket/entities/bucket.entity';
import { Exif } from '../../../../addon-api/types/Exif';

export const AssetStyles = {
  thumbnail_700_: `/thumbnail_700_`,
  thumbnail_300_: `/thumbnail_300_`,
  webp: '/webp',
  thumbnail_blur_: '/thumbnail_blur_',
};

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => CosBucket, { nullable: false, eager: true })
  bucket: Relation<CosBucket>;

  @Column({ type: 'json', default: {} })
  objectUrl: {
    webp: string;
    original: string;
    thumbnail_300_: string;
    thumbnail_700_: string;
    thumbnail_blur_: string;
  };

  @Column({ default: '' })
  originUrl: string;

  @Column({ default: '' })
  sn: string;

  @Column({ type: 'json' })
  tags: string[];

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
  uploadBy: Relation<User>;

  @CreateDateColumn({ type: 'timestamptz' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  @BeforeInsert()
  beforeInsert() {
    if (this.metadata) {
      this.size = pick(['width', 'height'])(this.metadata);
    }
    if (!this.tags) {
      this.tags = [];
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    if (this.metadata) {
      this.size = pick(['width', 'height'])(this.metadata);
    }
  }
}

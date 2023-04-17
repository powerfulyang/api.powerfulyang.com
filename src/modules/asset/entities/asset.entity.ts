import { User } from '@/modules/user/entities/user.entity';
import { Exif } from '@addon/types/Exif';
import { Metadata } from 'sharp';
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
import { CosBucket } from '../../bucket/entities/bucket.entity';

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
  @ManyToOne(() => CosBucket, { nullable: false })
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
  size: {
    width: number;
    height: number;
  };

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  uploadBy: Relation<User>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    if (this.metadata) {
      const { width = 0, height = 0 } = this.metadata;
      this.size = {
        width,
        height,
      };
    }
    if (!this.tags) {
      this.tags = [];
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    if (this.metadata) {
      const { width = 0, height = 0 } = this.metadata;
      this.size = {
        width,
        height,
      };
    }
  }
}

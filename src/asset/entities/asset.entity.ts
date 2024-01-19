import { ApiProperty } from '@nestjs/swagger';
import type { Exif } from 'exif-reader';
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
import { User } from '@/user/entities/user.entity';
import { CosBucket } from '@/bucket/entities/bucket.entity';

export const AssetStyles = {
  thumbnail_700_: `/thumbnail_700_`,
  thumbnail_300_: `/thumbnail_300_`,
  webp: '/webp',
  thumbnail_blur_: '/thumbnail_blur_',
};

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @JoinColumn()
  @ManyToOne(() => CosBucket, { nullable: false })
  @ApiProperty({
    type: () => CosBucket,
  })
  bucket: Relation<CosBucket>;

  @Column({ type: 'json', default: {} })
  @ApiProperty({
    allOf: [
      {
        type: 'object',
        properties: {
          webp: { type: 'string' },
          original: { type: 'string' },
          thumbnail_300_: { type: 'string' },
          thumbnail_700_: { type: 'string' },
          thumbnail_blur_: { type: 'string' },
        },
        required: ['webp', 'original', 'thumbnail_300_', 'thumbnail_700_', 'thumbnail_blur_'],
      },
    ],
  })
  objectUrl: {
    webp: string;
    original: string;
    thumbnail_300_: string;
    thumbnail_700_: string;
    thumbnail_blur_: string;
  };

  @Column({ default: '' })
  @ApiProperty()
  originUrl: string;

  @Column({ default: '' })
  @ApiProperty()
  sn: string;

  @Column({ type: 'json' })
  @ApiProperty()
  tags: string[];

  @Column({ default: '' })
  @ApiProperty()
  comment: string;

  /**
   * 需要注意，这里的值是不带 `.` 的
   */
  @Column()
  @ApiProperty()
  fileSuffix: string;

  @Column({ unique: true })
  @ApiProperty()
  sha1: string;

  @Column()
  @ApiProperty()
  pHash: string;

  @Column({ type: 'jsonb', select: false, nullable: true })
  @ApiProperty()
  exif: Exif | null;

  @Column({ type: 'jsonb', select: false })
  @ApiProperty()
  metadata: Metadata;

  @Column({
    default: '',
  })
  alt: string;

  @Column({ type: 'json' })
  @ApiProperty({
    anyOf: [
      {
        type: 'object',
        properties: {
          width: { type: 'number' },
          height: { type: 'number' },
        },
        required: ['width', 'height'],
      },
    ],
  })
  size: {
    width: number;
    height: number;
  };

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  @ApiProperty({
    type: () => User,
  })
  uploadBy: Relation<User>;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
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

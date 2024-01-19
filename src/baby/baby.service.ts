import type { CreateBabyMomentDto } from '@/baby/baby.dto';
import { LoggerService } from '@/common/logger/logger.service';
import { DEFAULT_R2_BUCKET_NAME } from '@/constants/constants';
import { S3Service } from '@/libs/s3';
import { PrismaService } from '@/service/prisma/prisma.service';
import type { UploadFile } from '@/type/UploadFile';
import { CreateBucketCommand, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpStatus, Injectable } from '@nestjs/common';
import { sha1 } from '@powerfulyang/node-utils';
import type { Prisma } from '@prisma/client';
import sharp from 'sharp';

@Injectable()
export class BabyService {
  constructor(
    private readonly logger: LoggerService,
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
  ) {
    this.logger.setContext(BabyService.name);
  }

  async createBucket(bucket: Prisma.Args<typeof this.prismaService.r2_bucket, 'create'>['data']) {
    // 判断数据库中是否存在该 bucket
    const exist = await this.prismaService.r2_bucket.findUnique({
      where: {
        name: bucket.name,
      },
    });
    if (exist) {
      return exist;
    }
    // 如果不存在则创建
    // transaction
    return this.prismaService.$transaction(async (tx) => {
      const result = await tx.r2_bucket.create({
        data: bucket,
      });
      // 判断 s3 中是否存在该 bucket
      const existCommand = new HeadBucketCommand({
        Bucket: result.name,
      });
      const existBucket = await this.s3Service.send(existCommand);
      if (existBucket.$metadata.httpStatusCode === HttpStatus.OK) {
        return result;
      }
      const createBucketCommand = new CreateBucketCommand({
        Bucket: result.name,
      });
      const createBucket = await this.s3Service.send(createBucketCommand);
      if (createBucket.$metadata.httpStatusCode === HttpStatus.OK) {
        return result;
      }
      throw new Error('create bucket failed');
    });
  }

  async upload(file: UploadFile, bucketName: string = DEFAULT_R2_BUCKET_NAME) {
    return this.prismaService.$transaction(async (tx) => {
      const fileBuffer = file.data;
      const fileHash = sha1(fileBuffer);
      const { mimetype } = file;
      let thumbnailMimetype;
      let thumbnailBuffer;
      let thumbnailHash;
      if (mimetype.startsWith('image')) {
        const thumbnail = sharp(file.data).rotate().resize(300, 300).webp();
        thumbnailBuffer = await thumbnail.toBuffer();
        thumbnailMimetype = await thumbnail.metadata().then((metadata) => metadata.format);
        thumbnailHash = sha1(thumbnailBuffer);
      }
      const result = await tx.r2_upload.create({
        data: {
          hash: fileHash,
          mediaType: mimetype,
          thumbnailHash,
          bucketName,
        },
      });
      await this.uploadToBucket({
        fileBuffer,
        fileHash,
        mimetype,
        thumbnailBuffer,
        thumbnailMimetype,
        thumbnailHash,
        bucketName,
      });
      return result;
    });
  }

  private async uploadToBucket(args: {
    fileBuffer: Buffer;
    fileHash: string;
    mimetype: string;
    thumbnailBuffer?: Buffer;
    thumbnailMimetype?: string;
    thumbnailHash?: string;
    bucketName: string;
  }) {
    const {
      fileBuffer,
      fileHash,
      mimetype,
      thumbnailBuffer,
      thumbnailMimetype,
      thumbnailHash,
      bucketName,
    } = args;
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileHash,
      Body: fileBuffer,
      ContentType: mimetype,
      CacheControl: 'max-age=31536000',
    });
    const putObject = await this.s3Service.send(putObjectCommand);
    if (putObject.$metadata.httpStatusCode !== HttpStatus.OK) {
      throw new Error('upload file failed');
    }
    if (thumbnailBuffer) {
      const putThumbnailCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: thumbnailHash,
        Body: thumbnailBuffer,
        ContentType: thumbnailMimetype,
        CacheControl: 'max-age=31536000',
      });
      const putThumbnail = await this.s3Service.send(putThumbnailCommand);
      if (putThumbnail.$metadata.httpStatusCode !== HttpStatus.OK) {
        throw new Error('upload thumbnail failed');
      }
    }
  }

  createMoment(moment: CreateBabyMomentDto) {
    return this.prismaService.baby_moment.create({
      data: {
        content: moment.content,
        type: moment.type,
        baby_moments_to_uploads: {
          create: moment.uploadIds.map((uploadId, index) => ({
            uploadId,
            order: index,
          })),
        },
      },
    });
  }
}

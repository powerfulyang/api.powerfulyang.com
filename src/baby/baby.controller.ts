import {
  CreateBabyBucketDto,
  CreateBabyEventDto,
  CreateBabyEventLogDto,
  CreateBabyMomentDto,
  QueryBabyEventLogDto,
  UpdateBabyEventDto,
  UpdateBabyEventLogDto,
} from '@/baby/baby.dto';
import { BabyService } from '@/baby/baby.service';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { QueryPagination } from '@/common/decorator/pagination/pagination.decorator';
import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { LoggerService } from '@/common/logger/logger.service';
import { PrismaService } from '@/service/prisma/prisma.service';
import { UploadFile } from '@/type/UploadFile';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('baby')
@ApiTags('baby')
@AdminAuthGuard()
export class BabyController {
  constructor(
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly babyService: BabyService,
  ) {
    this.logger.setContext(BabyController.name);
  }

  @Get('moment')
  async queryMoments(@QueryPagination() pagination: PaginatedBaseQuery) {
    const result = await this.prismaService.baby_moment.findMany({
      skip: pagination.skip,
      take: pagination.take,
      include: {
        baby_moments_to_uploads: {
          include: {
            r2_upload: {
              include: {
                r2_bucket: true,
              },
            },
          },
        },
      },
    });
    return result.map((item) => {
      const r2_uploads = item.baby_moments_to_uploads.map((upload) => {
        return upload.r2_upload;
      });
      return {
        ...item,
        r2_uploads,
      };
    });
  }

  @Post('moment')
  @ApiOperation({
    operationId: 'createMoment',
  })
  @ApiBody({
    type: CreateBabyMomentDto,
  })
  createMoment(@Body() moment: CreateBabyMomentDto) {
    return this.babyService.createMoment(moment);
  }

  @Post('bucket')
  @ApiOperation({
    operationId: 'createBucket',
  })
  @ApiBody({
    type: CreateBabyBucketDto,
  })
  createBucket(@Body() bucket: CreateBabyBucketDto) {
    return this.babyService.createBucket(bucket);
  }

  @Post('upload')
  @ApiOperation({
    operationId: 'upload',
  })
  @ApiConsumes('multipart/form-data')
  async upload(@Body('file') file: UploadFile, @Body('bucketName') bucketName?: string) {
    return this.babyService.upload(file, bucketName);
  }

  @Post('event')
  @ApiOperation({
    operationId: 'createEvent',
  })
  @ApiBody({
    type: CreateBabyEventDto,
  })
  async createEvent(@Body() event: CreateBabyEventDto) {
    return this.prismaService.baby_event.create({
      data: event,
    });
  }

  @Get('event')
  @ApiOperation({
    operationId: 'queryEvent',
  })
  async queryEvent() {
    return this.prismaService.baby_event.findMany();
  }

  @Patch('event/:eventId')
  @ApiOperation({
    operationId: 'updateEvent',
  })
  @ApiBody({
    type: UpdateBabyEventDto,
  })
  async updateEvent(@Body() event: UpdateBabyEventDto, @Param('eventId') eventId: string) {
    return this.prismaService.baby_event.update({
      where: {
        id: Number(eventId),
      },
      data: event,
    });
  }

  @Post('event-log')
  @ApiOperation({
    operationId: 'createEventLog',
  })
  @ApiBody({
    type: CreateBabyEventLogDto,
  })
  async createEventLog(@Body() eventLog: CreateBabyEventLogDto) {
    return this.prismaService.baby_event_log.create({
      data: eventLog,
    });
  }

  @Get('event-log')
  @ApiOperation({
    operationId: 'queryEventLog',
  })
  @ApiQuery({
    type: QueryBabyEventLogDto,
  })
  async queryEventLog(@Query() query: QueryBabyEventLogDto) {
    return this.prismaService.baby_event_log.findMany({
      where: query,
    });
  }

  @Patch('event-log/:eventLogId')
  @ApiOperation({
    operationId: 'updateEventLog',
  })
  @ApiBody({
    type: UpdateBabyEventLogDto,
  })
  async updateEventLog(
    @Body() eventLog: UpdateBabyEventLogDto,
    @Param('eventLogId') eventLogId: string,
  ) {
    return this.prismaService.baby_event_log.update({
      where: {
        id: Number(eventLogId),
      },
      data: eventLog,
    });
  }

  @Delete('event-log/:eventLogId')
  @ApiOperation({
    operationId: 'deleteEventLog',
  })
  async deleteEventLog(@Param('eventLogId') eventLogId: string) {
    return this.prismaService.baby_event_log.delete({
      where: {
        id: Number(eventLogId),
      },
    });
  }

  @Get('event-log/distinct')
  @ApiOperation({
    operationId: 'queryDistinctEventLog',
  })
  async queryDistinctEventLog() {
    return this.prismaService.baby_event_log.findMany({
      distinct: ['eventName', 'id'],
      select: {
        id: true,
        eventName: true,
      },
    });
  }
}

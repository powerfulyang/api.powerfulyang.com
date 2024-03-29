import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { QueryPagination } from '@/common/decorator/pagination/pagination.decorator';
import { AuthUser } from '@/common/decorator/user-from-auth.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { AssetService } from '@/asset/asset.service';
import { QueryAssetsDto } from '@/asset/dto/query-assets.dto';
import { User } from '@/user/entities/user.entity';
import type { UploadFile } from '@/type/UploadFile';
import { UploadAssetsDto } from '@/type/UploadFile';

@Controller('asset')
@AdminAuthGuard()
@ApiTags('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AssetController.name);
  }

  @Get('query-assets')
  @ApiOperation({
    summary: '分页查询资源',
    operationId: 'queryAssets',
  })
  queryAssets(@QueryPagination() pagination: QueryAssetsDto) {
    return this.assetService.queryAssets(pagination);
  }

  @Get('pHash/distance')
  async pHashMap() {
    return this.assetService.pHashMap();
  }

  @Post(':bucketName')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadAssetsDto,
  })
  @ApiOperation({
    summary: '上传资源',
    operationId: 'saveAssetToBucket',
  })
  saveAssetToBucket(
    @Body('assets') files: UploadFile[],
    @Body('files') files_compatible: UploadFile[],
    @Param('bucketName') bucketName: string,
    @AuthUser() user: User,
  ) {
    return this.assetService.saveAssetToBucket(files || files_compatible, bucketName, user);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '删除资源',
    operationId: 'deleteAsset',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          nullable: true,
        },
        ids: {
          type: 'array',
          items: {
            type: 'number',
          },
          nullable: true,
        },
      },
    },
  })
  deleteAsset(@Body('id') id: number, @Body('ids') ids: number[]) {
    return this.assetService.deleteAsset(ids || [id]);
  }

  // 给所有的 asset 添加一个 alt 属性
  @Get('addAlt')
  @ApiExcludeEndpoint()
  addAlt() {
    return this.assetService.addAlt();
  }

  @Get('backup/azuki')
  @ApiExcludeEndpoint()
  backupAzuki() {
    return this.assetService.backupZukui();
  }
}

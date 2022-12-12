import { Body, Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/common/logger/logger.service';
import { OfficialAccountService } from '@app/wechat/official-account.service';
import { WechatCheckSignatureRequest, WechatMessageOriginalRequest } from '@/typings/wechat';
import { FastifyReply } from 'fastify';

@Controller('official-account')
@ApiTags('official-account')
export class OfficialAccountController {
  constructor(
    private readonly logger: LoggerService,
    private readonly officialAccountService: OfficialAccountService,
  ) {
    this.logger.setContext(OfficialAccountController.name);
  }

  @Get('handle-message')
  @ApiExcludeEndpoint()
  checkSignature(@Query() query: WechatCheckSignatureRequest, @Res() reply: FastifyReply) {
    const echostr = this.officialAccountService.checkSignature(query);
    reply.send(echostr);
  }

  @Post('handle-message')
  @ApiExcludeEndpoint()
  @HttpCode(200)
  async handleOfficialAccountMessage(
    @Query() query: WechatCheckSignatureRequest,
    @Res() reply: FastifyReply,
    @Body() body: WechatMessageOriginalRequest,
  ) {
    this.officialAccountService.checkSignature(query);
    await this.officialAccountService.handleOfficialAccountMessage(body);
    reply.send('success');
  }
}

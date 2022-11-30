import { Body, Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import { MiniProgramService } from '@app/wechat/mini-program.service';
import {
  WechatCheckSignatureRequest,
  WechatGetUnlimitedQRCodeRequest,
  WechatMiniProgramMessageRequest,
} from '@/typings/wechat';
import { FastifyReply } from 'fastify';

@Controller('mini-program')
export class MiniProgramController {
  constructor(
    private readonly logger: LoggerService,
    private readonly miniProgramService: MiniProgramService,
  ) {
    this.logger.setContext(MiniProgramController.name);
  }

  @Get('subscribe-message')
  checkSignature(@Query() query: WechatCheckSignatureRequest, @Res() reply: FastifyReply) {
    const echostr = this.miniProgramService.checkSignature(query);
    reply.send(echostr);
  }

  @Post('subscribe-message')
  @HttpCode(200)
  subscribeMessage(
    @Query() query: WechatCheckSignatureRequest,
    @Res() reply: FastifyReply,
    @Body() body: WechatMiniProgramMessageRequest,
  ) {
    this.miniProgramService.checkSignature(query);
    this.miniProgramService.subscribeMessage(body);
    reply.send('success');
  }

  @Get('login')
  code2Session(@Query('code') code: string) {
    return this.miniProgramService.code2session(code);
  }

  @Get('qrcode')
  async getUnlimitedQRCode(
    @Query() query: WechatGetUnlimitedQRCodeRequest,
    @Res() reply: FastifyReply,
  ) {
    const res = await this.miniProgramService.getUnlimitedQRCode(query);
    reply.header('Content-Type', res.headers.get('content-type'));
    const buffer = await res.buffer();
    reply.send(buffer);
  }
}

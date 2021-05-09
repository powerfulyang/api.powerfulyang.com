import { Controller } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { MessagePatterns } from '@/constants/MessagePatterns';

@Controller()
export class HelloController {
  constructor(private logger: AppLogger) {
    this.logger.setContext(HelloController.name);
  }

  @MessagePattern(MessagePatterns.test)
  hello(@Ctx() context: RmqContext) {
    const message = context.getMessage();
    const channel = context.getChannelRef();
    this.logger.debug('hello');
    return channel.ack(message);
  }
}

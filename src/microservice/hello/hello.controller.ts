import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { LoggerService } from '@/common/logger/logger.service';
import { MessagePatterns } from '@/constants/MessagePatterns';

@Controller()
export class HelloController {
  constructor(private logger: LoggerService) {
    this.logger.setContext(HelloController.name);
  }

  @MessagePattern(MessagePatterns.test)
  hello(@Ctx() context: RmqContext) {
    const message = context.getMessage();
    const channel = context.getChannelRef();
    this.logger.debug('hello world!!!');
    return channel.ack(message);
  }
}

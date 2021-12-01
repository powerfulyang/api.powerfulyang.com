import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator.mjs';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator.mjs';
import { User } from '@/modules/user/entities/user.entity.mjs';
import { FeedService } from './feed.service.mjs';
import { CreateFeedDto } from './dto/create-feed.dto.mjs';
import { UpdateFeedDto } from './dto/update-feed.dto.mjs';

@Controller('feed')
@JwtAuthGuard()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  create(@Body() createFeedDto: CreateFeedDto, @UserFromAuth(['id']) user: User) {
    return this.feedService.postNewFeed(createFeedDto, user);
  }

  @Patch(':id')
  @AdminAuthGuard()
  update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedService.update(+id, updateFeedDto);
  }
}

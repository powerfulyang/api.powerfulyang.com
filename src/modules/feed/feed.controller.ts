import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { pluck } from 'ramda';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { FamilyMembersFromAuth, UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feed')
@JwtAuthGuard()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  create(@Body() createFeedDto: CreateFeedDto, @UserFromAuth(['id']) user: User) {
    return this.feedService.postNewFeed(createFeedDto, user);
  }

  @Get()
  findAll(@FamilyMembersFromAuth() users: User[]) {
    return this.feedService.feeds(pluck('id', users));
  }

  @Patch(':id')
  @AdminAuthGuard()
  update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedService.update(+id, updateFeedDto);
  }
}

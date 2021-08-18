import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { FamilyMembersFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/entity/user.entity';
import { pluck } from 'ramda';
import { In } from 'typeorm';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feed')
@JwtAuthGuard()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  create(@Body() createFeedDto: CreateFeedDto) {
    return this.feedService.create(createFeedDto);
  }

  @Get()
  findAll(@FamilyMembersFromAuth() users: User[]) {
    return this.feedService.relationQuery({
      createBy: In(pluck('id', users)),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedService.update(+id, updateFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedService.remove(+id);
  }
}

import {
    Controller,
    ForbiddenException,
    Get,
    Param,
} from '@nestjs/common';
import { PixivScheduleService } from '@/schedules/pixiv-schedule/pixiv-schedule.service';
import { InstagramScheduleService } from '@/schedules/instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from '@/schedules/pinterest-schedule/pinterest-schedule.service';
import { AssetBucket } from '@/enum/AssetBucket';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { SUCCESS } from '@/constants/constants';

@Controller('schedule')
@JwtAuthGuard()
export class ScheduleController {
    constructor(
        private pixivScheduleService: PixivScheduleService,
        private instagramScheduleService: InstagramScheduleService,
        private pinterestScheduleService: PinterestScheduleService,
    ) {}

    @Get(':scheduleType')
    async RunScheduleByRequest(
        @Param('scheduleType') scheduleType: AssetBucket,
    ) {
        switch (scheduleType) {
            case AssetBucket.instagram:
                await this.instagramScheduleService.bot();
                break;
            case AssetBucket.pinterest:
                await this.pinterestScheduleService.bot();
                break;
            case AssetBucket.pixiv:
                await this.pixivScheduleService.bot();
                break;
            default:
                throw new ForbiddenException();
        }
        return SUCCESS;
    }
}

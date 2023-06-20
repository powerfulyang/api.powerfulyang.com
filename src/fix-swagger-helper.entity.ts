import type { Feed } from '@/feed/entities/feed.entity';
import type { ViewCountDto } from '@/path-view-count/dto/view-count.dto';
import type { PushSubscriptionLog } from '@/web-push/entities/push-subscription-log.entity';

export class FixSwaggerHelperEntity {
  feed: Feed;

  viewCountDto: ViewCountDto;

  pushSubscriptionLog: PushSubscriptionLog;
}

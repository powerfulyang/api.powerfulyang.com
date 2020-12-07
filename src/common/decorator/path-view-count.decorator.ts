import { UseInterceptors } from '@nestjs/common';
import { PathViewCountInterceptor } from '@/common/interceptor/path.view.count.interceptor';

export const PathViewCount = () => {
  return UseInterceptors(PathViewCountInterceptor);
};

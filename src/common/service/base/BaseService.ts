import { Between, LessThan, MoreThan } from 'typeorm';
import { isDefined } from '@powerfulyang/utils';

export class BaseService {
  generateInfiniteCursor({
    nextCursor,
    prevCursor,
  }: {
    nextCursor?: string | number;
    prevCursor?: string | number;
  } = {}) {
    if (nextCursor && prevCursor) {
      return Between(Number(nextCursor), Number(prevCursor));
    }
    if (nextCursor) {
      return MoreThan(Number(nextCursor));
    }
    if (prevCursor) {
      return LessThan(Number(prevCursor));
    }
    return undefined;
  }

  formatInfiniteTake(take?: string | number) {
    return isDefined(take) ? Number(take) : undefined;
  }
}

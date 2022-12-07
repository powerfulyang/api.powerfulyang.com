import { Between, ILike, LessThan, MoreThan } from 'typeorm';
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

  convertDateRangeToBetween(dateRange?: [Date | undefined, Date | undefined]) {
    if (!dateRange) {
      return undefined;
    }
    const [start, end] = dateRange;
    if (!start && end) {
      return LessThan(end);
    }
    if (!end && start) {
      return MoreThan(start);
    }
    if (start && end) {
      return Between(start, end);
    }
    return undefined;
  }

  iLike(value?: string) {
    return value ? ILike(`%${value}%`) : undefined;
  }

  ignoreFalsyValue<T>(value: T) {
    return value || undefined;
  }
}

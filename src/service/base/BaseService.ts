import { isDefined, isNotNil } from '@powerfulyang/utils';
import dayjs from 'dayjs';
import { Between, ILike, In, LessThan, MoreThan } from 'typeorm';

export class BaseService {
  protected generateInfiniteCursor({
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

  protected formatInfiniteTake(take?: string | number) {
    return isDefined(take) ? Number(take) : undefined;
  }

  protected convertDateRangeToBetween(dateRange?: [Date | undefined, Date | undefined]) {
    if (!dateRange) {
      return undefined;
    }
    let [start, end] = dateRange;
    if (start) {
      start = dayjs(start).startOf('date').toDate();
    }
    if (end) {
      end = dayjs(end).endOf('date').toDate();
    }
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

  protected iLike(value?: string) {
    return value ? ILike(`%${value}%`) : undefined;
  }

  protected ignoreFalsyValue<T>(value: T) {
    return value || undefined;
  }

  protected ignoreNilValue<T>(value: T) {
    return isNotNil(value) ? value : undefined;
  }

  protected ignoreEmptyString(value?: string) {
    return value === '' ? undefined : value;
  }

  protected ignoreEmptyArray<T>(value?: T[]) {
    return value?.length ? In(value) : undefined;
  }
}

import { Between, ILike, In, LessThan, MoreThan } from 'typeorm';
import { isDefined } from '@powerfulyang/utils';
import { HttpStatus } from '@nestjs/common';
import dayjs from 'dayjs';

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

  iLike(value?: string) {
    return value ? ILike(`%${value}%`) : undefined;
  }

  ignoreFalsyValue<T>(value: T) {
    return value || undefined;
  }

  ignoreEmptyArray<T>(value?: T[]) {
    return value?.length ? In(value) : undefined;
  }

  getAuthHeader(userString: string) {
    return {
      Authorization: `Basic ${Buffer.from(userString).toString('base64')}`,
    };
  }

  // trigger algolia sync
  async reindexAlgoliaCrawler() {
    const crawlerId = process.env.ALGOLIA_CRAWLER_ID;
    const crawlerUserId = process.env.ALGOLIA_CRAWLER_USER_ID;
    const crawlerApiKey = process.env.ALGOLIA_CRAWLER_API_KEY;
    if (!crawlerId || !crawlerUserId || !crawlerApiKey) {
      // ignore if no crawler id
      return null;
    }
    const headers = this.getAuthHeader(`${crawlerUserId}:${crawlerApiKey}`);
    // run a crawler
    const res = await fetch(`https://crawler.algolia.com/api/1/crawlers/${crawlerId}/reindex`, {
      method: 'POST',
      headers,
    });
    if (res.status !== HttpStatus.OK) {
      throw new Error('run algolia crawler failed');
    }
    const json = await res.json();
    if (json.taskId) {
      return json.taskId;
    }
    throw new Error('run algolia crawler failed');
  }
}

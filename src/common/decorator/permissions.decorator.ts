import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export enum Permission {
  // Feed
  FeedManageQuery = 'feed-manage:query',
  FeedManageDelete = 'feed-manage:delete',
}

export const Permissions = (...permissions: Permission[]): CustomDecorator<typeof Permission> => {
  return SetMetadata(Permission, permissions);
};

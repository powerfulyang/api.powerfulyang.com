import { AccessGuard } from '@/common/authorization/access-guard';
import { AdminGuard } from '@/common/authorization/admin-guard';
import { PermissionGuard } from '@/common/authorization/permission-guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiExcludeEndpoint } from '@nestjs/swagger';

export const JwtAuthGuard = () => {
  return applyDecorators(UseGuards(AuthGuard('jwt')), ApiCookieAuth());
};
export const GoogleAuthGuard = () => {
  return applyDecorators(UseGuards(AuthGuard('google')), ApiExcludeEndpoint());
};
export const GithubAuthGuard = () => {
  return applyDecorators(UseGuards(AuthGuard('github')), ApiExcludeEndpoint());
};
export const AdminAuthGuard = () => {
  return applyDecorators(UseGuards(AuthGuard('jwt'), AdminGuard), ApiCookieAuth());
};
export const AccessAuthGuard = () => {
  return applyDecorators(UseGuards(AuthGuard('jwt'), AccessGuard), ApiCookieAuth());
};
export const PublicAuthGuard = () => {
  return applyDecorators(UseGuards(AuthGuard('public')), ApiCookieAuth());
};
export const PermissionAuthGuard = () => {
  return applyDecorators(UseGuards(AuthGuard('jwt'), PermissionGuard), ApiCookieAuth());
};

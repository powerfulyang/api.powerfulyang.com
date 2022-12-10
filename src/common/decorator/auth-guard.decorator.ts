import { AuthGuard } from '@nestjs/passport';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from '@/common/authorization/admin-guard';
import { AccessGuard } from '@/common/authorization/access-guard';
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

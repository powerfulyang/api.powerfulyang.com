import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '@/common/decorator/admin-guard.decorator';

export const JwtAuthGuard = () => UseGuards(AuthGuard('jwt'));
export const GoogleAuthGuard = () => UseGuards(AuthGuard('google'));
export const GithubAuthGuard = () => UseGuards(AuthGuard('github'));
export const AdminAuthGuard = () => UseGuards(AdminGuard);
export const PublicAuthGuard = () => UseGuards(AuthGuard('public'));

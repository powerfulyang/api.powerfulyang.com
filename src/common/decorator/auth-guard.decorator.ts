import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

export const JwtAuthGuard = () => UseGuards(AuthGuard('jwt'));
export const GoogleAuthGuard = () => UseGuards(AuthGuard('google'));

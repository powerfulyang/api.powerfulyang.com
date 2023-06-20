import { SupportOauthApplication } from '@/oauth-application/entities/support-oauth.application';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class OauthApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  platformName: SupportOauthApplication;

  @Column({ select: false })
  clientId: string;

  @Column({ select: false })
  clientSecret: string;

  @Column({ select: false })
  callbackUrl: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

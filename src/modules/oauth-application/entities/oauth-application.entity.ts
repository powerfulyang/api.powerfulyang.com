import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SupportOauthApplication {
  google = 'google',
  github = 'github',
}

@Entity()
export class OauthApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  platformName: SupportOauthApplication;

  @Column({ select: false })
  clientId: string;

  @Column({ select: false })
  clientSecret: string;

  @Column({ select: false })
  callbackUrl: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

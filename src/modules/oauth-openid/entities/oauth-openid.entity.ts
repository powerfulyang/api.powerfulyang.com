import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User, UserOmitRelations } from '@/modules/user/entities/user.entity';
import { OauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';

@Entity()
@Index(['application', 'openid'], { unique: true })
export class OauthOpenid {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => OauthApplication, { eager: true, nullable: false })
  application: OauthApplication;

  @Column()
  openid: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, eager: true })
  user: UserOmitRelations;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

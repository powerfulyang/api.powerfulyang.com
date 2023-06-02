import { OauthApplication } from '@/oauth-application/entities/oauth-application.entity';
import { User } from '@/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['application', 'openid'], { unique: true })
export class OauthOpenid {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => OauthApplication, { nullable: false })
  application: OauthApplication;

  @Column()
  openid: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  user: Relation<User>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

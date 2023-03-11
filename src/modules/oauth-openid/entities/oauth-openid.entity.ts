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
import { User } from '@/modules/user/entities/user.entity';
import { OauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';

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
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;
}

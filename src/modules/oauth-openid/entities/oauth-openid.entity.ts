import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

export enum OauthApplication {
  google,
}

@Entity()
@Index(['application', 'openid'], { unique: true })
export class OauthOpenid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  application: OauthApplication;

  @Column()
  openid: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false, eager: true })
  user: User;
}

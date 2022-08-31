import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/modules/user/entities/role.entity';
import { Family } from '@/modules/user/entities/family.entity';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';

@Entity('user')
export class User {
  static IntendedUsers = {
    AdminUser: 'powerfulyang',
    BotUser: 'asset bot',
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: '', select: false })
  // 密码为 空字符, 则代表禁止密码登录
  saltedPassword: string;

  @Column({ default: '', select: false })
  salt: string;

  @Column()
  nickname: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  avatar?: string;

  @Column({ default: '' })
  lastIp: string;

  @Column({ default: '' })
  lastAddress: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @JoinColumn()
  @ManyToOne(() => Asset, { eager: true })
  timelineBackground: Relation<Asset>;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Relation<Role[]>;

  @ManyToMany(() => Family, (family) => family.members, { onDelete: 'CASCADE' })
  @JoinTable()
  families: Relation<Family[]>;

  // 大部分时间应该不需要 { eager: true }
  @OneToMany(() => OauthOpenid, (o) => o.user)
  oauthOpenidArr: Relation<OauthOpenid[]>;
}

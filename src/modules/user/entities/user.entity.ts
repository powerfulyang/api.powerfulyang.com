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
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/modules/user/entities/role.entity';
import { Family } from '@/modules/user/entities/family.entity';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  // 密码为 null, 则代表禁止密码登录
  password: string;

  @Column({ nullable: true })
  passwordSalt: string;

  @Column()
  nickname: string;

  @Column({ default: '' })
  bio: string;

  @Column()
  avatar: string;

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
  timelineBackground: Asset;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Family, (family) => family.members, { onDelete: 'CASCADE' })
  @JoinTable()
  families: Family[];

  // 大部分时间应该不需要 { eager: true }
  @OneToMany(() => OauthOpenid, (o) => o.user)
  oauthOpenidArr: OauthOpenid[];
}

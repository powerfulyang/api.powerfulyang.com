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
  static RelationColumnTimelineBackground = 'timelineBackground';

  static RelationColumnFamilies = 'families';

  static RelationColumnFamilyMembers = 'families.members';

  static RelationColumnOauthOpenidArr = 'oauthOpenidArr';

  static RelationColumnRoles = 'roles';

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

  @JoinColumn()
  @ManyToOne(() => Asset)
  timelineBackground: Asset;

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

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Family, (family) => family.members)
  @JoinTable()
  families: Family[];

  @OneToMany(() => OauthOpenid, (o) => o.user)
  oauthOpenidArr: OauthOpenid[];
}

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
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
  static IntendedUsers = {
    AdminUser: 'powerfulyang',
    BotUser: 'asset bot',
  };

  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'User id', example: 1 })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: 'User email', example: 'i@powerfulyang.com' })
  email: string;

  @Column({ default: '', select: false })
  // 密码为 空字符, 则代表禁止密码登录
  saltedPassword: string;

  @Column({ default: '', select: false })
  salt: string;

  @Column()
  @ApiProperty()
  nickname: string;

  @Column({ default: '' })
  @ApiProperty()
  bio: string;

  @Column({ default: '' })
  @ApiProperty()
  avatar?: string;

  @Column({ default: '' })
  @ApiProperty()
  lastIp: string;

  @Column({ default: '' })
  @ApiProperty()
  lastAddress: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  updateAt: Date;

  @JoinColumn()
  @ManyToOne(() => Asset, { eager: true })
  @ApiProperty()
  timelineBackground: Relation<Asset>;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  @ApiProperty({
    type: [Role],
    description: 'User roles',
  })
  roles: Relation<Role[]>;

  @ManyToMany(() => Family, (family) => family.members, { onDelete: 'CASCADE' })
  @JoinTable()
  @ApiProperty()
  families: Relation<Family[]>;

  // 大部分时间应该不需要 { eager: true }
  @OneToMany(() => OauthOpenid, (o) => o.user)
  @ApiProperty()
  oauthOpenidArr: Relation<OauthOpenid[]>;
}

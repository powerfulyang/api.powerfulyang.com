import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
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
import { Asset } from '@/asset/entities/asset.entity';
import { OauthOpenid } from '@/oauth-openid/entities/oauth-openid.entity';
import { Family } from '@/user/entities/family.entity';
import { Role } from '@/user/entities/role.entity';

@Entity('user')
@ObjectType()
export class User {
  static IntendedUsers = {
    AdminUser: 'powerfulyang',
    BotUser: 'asset bot',
  };

  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'User id', example: 1 })
  @Field(() => ID)
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
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  updatedAt: Date;

  @JoinColumn()
  @ManyToOne(() => Asset)
  @ApiProperty({
    type: () => Asset,
  })
  timelineBackground: Relation<Asset>;

  @ManyToMany(() => Role)
  @JoinTable()
  @ApiProperty({
    type: () => [Role],
    description: 'User roles',
  })
  roles: Relation<Role[]>;

  @ManyToMany(() => Family, (family) => family.members, { onDelete: 'CASCADE' })
  @JoinTable()
  @ApiProperty({
    type: () => [Family],
  })
  families: Relation<Family[]>;

  // 大部分时间应该不需要 { eager: true }
  @OneToMany(() => OauthOpenid, (o) => o.user)
  @ApiProperty({
    type: () => [OauthOpenid],
  })
  oauthOpenidArr: Relation<OauthOpenid[]>;
}

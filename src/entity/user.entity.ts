import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/entity/role.entity';
import { Family } from '@/entity/family.entity';
import { Asset } from '@/entity/asset.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email: string;

  @Column()
  passwordSalt: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({ default: '' })
  bio: string;

  @JoinColumn()
  @OneToOne(() => Asset)
  timelineBackground: Asset;

  static RelationColumnTimelineBackground = 'timelineBackground';

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

  @Column({ unique: true })
  googleOpenId: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Family, (family) => family.members)
  @JoinTable()
  families: Family[];

  static RelationColumnFamilies = 'families';

  static RelationColumnFamilyMembers = 'families.members';
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/entity/role.entity';
import { Family } from '@/entity/family.entity';

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

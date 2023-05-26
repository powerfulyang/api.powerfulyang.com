import { User } from '@/modules/user/entities/user.entity';
import { PushSubscriptionJSON } from '@/web-push/PushSubscriptionJSON';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PushSubscriptionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'jsonb',
  })
  pushSubscriptionJSON: PushSubscriptionJSON;

  @Index({
    unique: true,
  })
  @Column({
    type: 'varchar',
    generatedType: 'STORED',
    asExpression: `"pushSubscriptionJSON"->>'endpoint'`,
  })
  endpoint: string;

  @JoinColumn()
  @ManyToOne(() => User, {
    nullable: true,
  })
  user?: User;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;
}

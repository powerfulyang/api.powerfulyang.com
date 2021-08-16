import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PathViewCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  path: string;

  @Column({ type: 'bigint' })
  ip: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

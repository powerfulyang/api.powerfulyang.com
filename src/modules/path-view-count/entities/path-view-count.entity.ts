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

  @CreateDateColumn({ type: 'timestamptz' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;
}

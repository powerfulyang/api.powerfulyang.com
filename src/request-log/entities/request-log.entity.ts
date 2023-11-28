import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  path: string;

  @Column()
  ip: string;

  @Column()
  ipInfo: string;

  @Column()
  method: string;

  @Column()
  statusCode: number;

  @Column()
  contentLength: string;

  @Column()
  processTime: string;

  @Column()
  referer: string;

  @Column()
  userAgent: string;

  @Column()
  requestId: string;

  @Column()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

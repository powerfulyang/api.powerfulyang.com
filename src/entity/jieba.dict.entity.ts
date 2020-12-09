import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class JieBaDict {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dict: string;

  @Column()
  weight: number;

  @Column()
  speech: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PathViewCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  ip: string;
}

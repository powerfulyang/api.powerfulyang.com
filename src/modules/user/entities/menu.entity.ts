import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Relation,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity('menu')
@Tree('closure-table')
export class Menu {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  path: string;

  @TreeChildren()
  @ApiProperty()
  children: Relation<Menu[]>;

  @TreeParent()
  @ApiProperty()
  parent: Relation<Menu>;

  @Column({ default: null })
  @ApiProperty({
    type: Number,
    nullable: true,
  })
  readonly parentId: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  updatedAt: Date;
}

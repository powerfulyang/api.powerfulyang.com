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

  @CreateDateColumn()
  @ApiProperty()
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updateAt: Date;
}

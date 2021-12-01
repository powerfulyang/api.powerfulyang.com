import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity('menu')
@Tree('closure-table')
export class Menu {
  constructor(menuName?: string, path?: string) {
    this.menuName = menuName;
    this.path = path;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  menuName?: string;

  @Column()
  path?: string;

  @TreeChildren()
  children: Menu[];

  @TreeParent()
  parent: Menu;

  @Column({ default: 0 })
  readonly parentId: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

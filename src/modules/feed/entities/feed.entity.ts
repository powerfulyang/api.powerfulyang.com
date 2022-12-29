import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { User } from '@/modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'timeline item id',
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'timeline item content',
  })
  content: string;

  @ManyToMany(() => Asset, { onDelete: 'CASCADE' })
  @JoinTable()
  @ApiProperty({
    description: 'timeline item assets',
  })
  assets: Asset[];

  @Column({ default: false })
  public: boolean;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  createBy: User;

  @JoinColumn()
  @ManyToOne(() => User)
  updateBy: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;
}

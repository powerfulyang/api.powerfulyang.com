import { ApiProperty } from '@nestjs/swagger';
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
import { Asset } from '@/asset/entities/asset.entity';
import { User } from '@/user/entities/user.entity';

@Entity('feed')
export class Feed {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  content: string;

  @ManyToMany(() => Asset, { onDelete: 'CASCADE' })
  @JoinTable()
  @ApiProperty({
    type: [Asset],
  })
  assets: Asset[];

  @Column({ default: false })
  @ApiProperty()
  public: boolean;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: false })
  @ApiProperty()
  createBy: User;

  @JoinColumn()
  @ManyToOne(() => User)
  @ApiProperty()
  updateBy: User;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  updatedAt: Date;
}

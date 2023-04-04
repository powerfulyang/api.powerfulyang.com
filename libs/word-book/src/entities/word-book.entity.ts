import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('word_book')
export class WordBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    description: '单词',
  })
  word: string;

  @Column()
  @ApiProperty({
    description: '翻译',
  })
  translation: string;

  @Column()
  @ApiProperty({
    description: '音标',
  })
  phonetic: string;

  @Column()
  @ApiProperty({
    description: '音频',
  })
  audio: string;

  @Column()
  @ApiProperty({
    description: '例句',
  })
  example: string;

  @Column()
  @ApiProperty({
    description: '例句翻译',
  })
  exampleTranslation: string;

  @Column()
  @ApiProperty({
    description: '例句音频',
  })
  exampleAudio: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;
}

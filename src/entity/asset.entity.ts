import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Bucket } from './bucket.entity';

@Entity('asset')
export class Asset {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => Bucket)
    bucket: Bucket;

    @Column({ default: '' })
    comment: string;

    @Column({ unique: true })
    sha1: string;

    @Column({ default: '' })
    pHash: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}

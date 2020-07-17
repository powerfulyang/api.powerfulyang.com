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
import { StaticPath } from '../type/UploadFile';

@Entity('static')
export class StaticResource {
    @PrimaryGeneratedColumn()
    staticId!: number;

    @JoinColumn()
    @ManyToOne(() => Bucket)
    bucket!: Bucket;

    @Column()
    filename!: string;

    @Column({ type: 'json' })
    path!: StaticPath;

    @Column()
    projectName!: string;

    @Column({ default: '' })
    comment!: string;

    @Column({ unique: true })
    sha1!: string;

    @Column({ default: '' })
    pHash!: string;

    @CreateDateColumn()
    createAt!: Date;

    @UpdateDateColumn()
    updateAt!: Date;
}

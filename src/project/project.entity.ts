import { User } from "src/user/user.entity";
import {
    Column, CreateDateColumn, Entity,
    ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";


@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ default: false })
    isArchive: boolean;

    @CreateDateColumn({ name: 'created_date' })
    createdDate: Date;

    @UpdateDateColumn({ name: 'modified_date' })
    modifiedDate: Date;

    @ManyToOne(() => User, (user) => user.projects, {
        onDelete: 'CASCADE',
    })
    user: User;
}
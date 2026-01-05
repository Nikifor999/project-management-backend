import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('refresh_tokens')
export class RefreshToken {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
    })
    user: User;

    @Index()
    @Column()
    tokenHash: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    revokedAt: Date | null;
}
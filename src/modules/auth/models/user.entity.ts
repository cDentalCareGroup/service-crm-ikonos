import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ nullable: true })
    token: string

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP", nullable: true })
    createdAt: Date
}
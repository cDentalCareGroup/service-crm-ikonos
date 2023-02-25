import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_logs')
export class UserLogsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'login_date',
        type: 'datetime'
    })
    loginDate: Date;

    @Column({
        name: 'info',
        type: 'text'
    })
    info: String;

    @Column({ name: 'user', type: 'varchar', length: 45 })
    username: string;

    @Column({ name: 'password', type: 'varchar', length: 45 })
    password: string;
}
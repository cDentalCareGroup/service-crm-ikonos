import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('call_logs')
export class CallLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'started_at',
        type: 'varchar',
    })
    startedAt: string;

    @Column({
        name: 'finished_at',
        type: 'varchar',
    })
    finishedAt: string;

    @Column({
        name: 'result',
        type: 'varchar',
    })
    result: string;


    @Column({
        name: 'call_id',
        type: 'int',
    })
    callId: number;
}
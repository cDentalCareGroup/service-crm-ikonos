import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum CallResult {
    CALL = 'llamada',
    ACTIVE = 'activa',
    APPOINTMENT = 'cita'
}

@Entity('call')
export class CallEntity {
    @PrimaryGeneratedColumn({ name: 'ID' })
    id: number;

    @Column({
        name: 'patient_id',
        type: 'int',
    })
    patientId: number;

    @Column({
        name: 'appointment_id',
        type: 'int',
    })
    appointmentId: number;

    @Column({
        name: 'call_due_date',
        type: 'date',
    })
    dueDate: Date;

    @Column({
        name: 'call_description',
        type: 'varchar',
    })
    description: string;


    @Column({
        name: 'call_catalog_id',
        type: 'int',
    })
    caltalogId: number;


    @Column({
        name: 'status',
        type: 'varchar',
    })
    status: string;


    @Column({
        name: 'call_effective_date',
        type: 'datetime',
    })
    effectiveDate: Date;

    @Column({
        name: 'comments',
        type: 'varchar',
    })
    comments: string;

    @Column({
        name: 'call_result',
        type: 'enum',
        enum: CallResult,
        default: CallResult.ACTIVE
    })
    result: CallResult;
}



import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum CallResult {
    CALL = 'call',
    ACTIVE = 'active',
    APPOINTMENT = 'appointment'
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
        name: 'prospect_id',
        type: 'int',
    })
    prospectId: number;

    @Column({
        name: 'appointment_id',
        type: 'int',
    })
    appointmentId: number;

    @Column({
        name: 'call_due_date',
        type: 'varchar',
    })
    dueDate: string;

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
        type: 'varchar',
    })
    effectiveDate: string;

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


    @Column({
        name: 'call_comments',
        type: 'varchar',
    })
    callComments: string;

    @Column({
        name: 'branch_id',
        type: 'int',
    })
    branchId: number;

    @Column({
        name: 'branch_name',
        type: 'varchar',
    })
    branchName: string;

}



import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('appointment_times')
export class AppointmentTimesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'appointment_id',
        type: 'int',
    })
    appointmentId: number;

    @Column({
        name: 'time',
        type: 'varchar',
    })
    time: string;

    @Column({
        name: 'status',
        type: 'varchar',
    })
    status: string;

    @Column({
        name: 'appointment',
        type: 'varchar',
    })
    appointment: string;

    @Column({
        name: 'branch_office_id',
        type: 'int',
    })
    branchOfficeId: number;
}
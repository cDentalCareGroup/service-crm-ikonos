import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('appointment_referral')
export class AppointmentReferralEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'appointment_id',
        type: 'int',
    })
    appointmentId: number;

    @Column({
        name: 'employee_id',
        type: 'int',
    })
    employeeId: number;

    @Column({
        name: 'folio',
        type: 'varchar',
    })
    folio: string;
}
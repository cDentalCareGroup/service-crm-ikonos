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
        name: 'referral_code',
        type: 'varchar',
    })
    referalCode: string;

    @Column({
        name: 'folio',
        type: 'varchar',
    })
    folio: string;
}
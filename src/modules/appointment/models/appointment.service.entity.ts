import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('appointment_service')
export class AppointmentServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'appointment_id',
        type: 'int',
    })
    appointmentId: number;
    @Column({
        name: 'service_id',
        type: 'int',
    })
    serviceId: number;
}
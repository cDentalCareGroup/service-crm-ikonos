import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('appointment_detail')
export class AppointmentDetailEntity {
    @PrimaryGeneratedColumn({name:'ID'})
    id: number;

    @Column({
        name: 'appointment_id',
        type: 'int',
    })
    appointmentId: number;

    @Column({
        name: 'patient_id',
        type: 'int',
    })
    patientId: number;

    @Column({
        name: 'dentist_id',
        type: 'int',
    })
    dentistId: number;

    @Column({
        name: 'service_id',
        type: 'int',
    })
    serviceId: number;


    @Column({
        name: 'quantity',
        type: 'decimal',
    })
    quantity: number;


    @Column({
        name: 'unit_price',
        type: 'decimal',
    })
    unitPrice: number;

    @Column({
        name: 'discount',
        type: 'decimal',
    })
    discount: number;


    @Column({
        name: 'price',
        type: 'decimal',
    })
    price: number;

    @Column({
        name: 'subtotal',
        type: 'decimal',
    })
    subTotal: number;

    @Column({
        name: 'comments',
        type: 'varchar',
    })
    comments: string;


}
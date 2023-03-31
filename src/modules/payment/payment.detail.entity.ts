import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment_detail')
export class PaymentDetailEntity {
    @PrimaryGeneratedColumn({name:'ID'})
    id: number;

    @Column({
        name: 'patient_id',
        type: 'int',
    })
    patientId: number;

    @Column({
        name: 'reference_id',
        type: 'int',
    })
    referenceId: number;


    @Column({
        name: 'payment_id',
        type: 'int',
    })
    paymentId: number;

    // @Column({
    //     name: 'movement_type_id',
    //     type: 'int',
    // })
    // movementTypeId: Number;


    @Column({
        name: 'movement_type_application_id',
        type: 'int',
    })
    movementTypeApplicationId: number;

    
    @Column({
        name: 'amount',
        type: 'decimal',
    })
    amount: number;

    
    @Column({
        name: 'created_at',
        type: 'datetime',
        default: () => 'NOW()',
    })
    createdAt: Date;


    // @Column({
    //     name: 'status',
    //     type: 'char',
    // })
    // status: String;

    @Column({
        name: 'movement_type',
        type: 'char',
    })
    movementType: String;

    @Column({
        name: 'sign',
        type: 'char',
    })
    sign: String;

    @Column({
        name: 'order',
        type: 'int',
    })
    order: number;


    @Column({
        name: 'payment_method_id',
        type: 'int',
    })
    paymentMethodId: number;

    @Column({
        name: 'branch_id',
        type: 'int',
    })
    branchOfficeId: number;

    @Column({
        name: 'dentist_id',
        type: 'int',
    })
    dentistId: number;
    
}
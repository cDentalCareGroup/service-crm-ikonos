import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment')
export class PaymentEntity {
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
        name: 'movement_type_id',
        type: 'int',
    })
    movementTypeId: number;


    @Column({
        name: 'payment_method_id',
        type: 'int',
    })
    paymentMethodId: number;

    @Column({
        name: 'amount',
        type: 'decimal',
    })
    amount: number;


    @Column({
        name: 'movement_type',
        type: 'char',
    })
    movementType: String;


    @Column({
        name: 'movement_sign',
        type: 'char',
    })
    movementSign: String;


    @Column({
        name: 'created_at',
        type: 'datetime',
    })
    createdAt: Date;
    
    
    @Column({
        name: 'due_date',
        type: 'datetime',
    })
    dueDate: Date;

    @Column({
        name: 'status',
        type: 'char',
    })
    status: string;

    isAplicable?: boolean;  
    
}
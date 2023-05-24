import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('accounts_payable_detail')
export class AccountPayableDetailEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number; 


    @Column({
        name: 'branch_id',
        type: 'int',
    })
    branchId: number;

    @Column({
        name: 'provider_id',
        type: 'int',
    })
    providerId: number;

    @Column({
        name: 'account_payable_id',
        type: 'int',
    })
    accountPayableId: number;

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
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: string;

    @Column({
        name: 'movement_type',
        type: 'varchar',
    })
    movementType: string;

    @Column({
        name: 'sign',
        type: 'varchar',
    })
    sign: string;

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
    
}
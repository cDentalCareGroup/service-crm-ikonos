import { STATUS_ACTIVE } from "src/utils/general.functions.utils";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum AccountPayableOrigin {
    APPOINTMENT = 'cita',
    EXPENSE = 'gasto',
}

export enum AccountPayableProviderType {
    FINANCIAL = 'financiero',
    DENTIST = 'dentista',
    SERVICES = "servicios",
    LABS = "laboratorio",
    SELLS = "ventas",
    REGALIA = "regalia",
    BRANCH_OFFICE = "clinica"
}



@Entity('accounts_payable')
export class AccountPayableEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({
        name: 'origin',
        type: 'enum',
        enum: AccountPayableOrigin,
        default: AccountPayableOrigin.APPOINTMENT
    })
    origin: AccountPayableOrigin;

    @Column({
        name: 'provider_id',
        type: 'int',
    })
    providerId: number;

    @Column({
        name: 'provider_name',
        type: 'varchar',
    })
    providerName: string;

    @Column({
        name: 'provider_type',
        type: 'enum',
        enum: AccountPayableProviderType,
        default: AccountPayableProviderType.LABS
    })
    providerType: AccountPayableProviderType;

    @Column({
        name: 'status',
        type: 'varchar',
    })
    status: string;

    @Column({
        name: 'amount',
        type: 'decimal',
    })
    amount: number;

    @Column({
        name: 'reference_id',
        type: 'int',
    })
    referenceId: number;


    @Column({
        name: 'movement_type',
        type: 'varchar',
    })
    movementType: string;

    @Column({
        name: 'movement_sign',
        type: 'varchar',
    })
    movementSign: string;

    @Column({
        name: 'due_date',
        type: 'varchar',
    })
    dueDate: string;

    @Column({
        name: 'branch_id',
        type: 'int',
    })
    branchId: number;


    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: string;
}
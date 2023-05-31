import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment_method')
export class PaymentMethodEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        name: 'name',
        type: 'varchar',
    })
    name: string;

    @Column({
        name: 'commission',
        type: 'decimal',
    })
    commission: number;

    @Column({
        name: 'tax',
        type: 'decimal',
    })
    tax: number;
}
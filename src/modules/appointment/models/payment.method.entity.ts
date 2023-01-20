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
}
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('service')
export class ServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'category_id',
        type: 'int',
    })
    categoryId: number;

    @Column({
        name: 'name',
        type: 'varchar',
    })
    name: string;


    @Column({
        name: 'price',
        type: 'decimal',
    })
    price: number;

    @Column({
        name: 'status',
        type: 'varchar',
    })
    status: string;

    @Column({
        name: 'lab_cost',
        type: 'decimal',
    })
    labCost: number;

    @Column({
        name: 'minimum_percentage_payment',
        type: 'decimal',
    })
    minimumPercentagePayment: number;
    
    
}
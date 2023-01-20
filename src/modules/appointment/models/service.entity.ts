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
        name: 'type',
        type: 'int',
    })
    type: number;

    @Column({
        name: 'price',
        type: 'decimal',
    })
    price: number;
}
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('service_category')
export class ServiceCategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
    })
    name: string;
}
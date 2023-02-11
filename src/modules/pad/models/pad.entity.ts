import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pad')
export class PadEntity {
    @PrimaryGeneratedColumn({ name: 'ID' })
    id: number;

    @Column({ name: 'pad_catalogue_id', type: 'int' })
    padCatalogueId: number;


    @Column({ name: 'pad_price', type: 'decimal' })
    padPrice: number;

    @Column({ name: 'pad_type', type: 'varchar' })
    padType: string;


    @Column({ name: 'pad_adquisition_date', type: 'date' })
    padAdquisitionDate: Date;


    @Column({ name: 'pad_due_date', type: 'date' })
    padDueDate: Date;

}
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pad_component')
export class PadComponenEntity {
    @PrimaryGeneratedColumn({ name: 'ID' })
    id: number;

    @Column({ name: 'pad_catalogue_id', type: 'int' })
    padCatalogueId: number;

    @Column({ name: 'service_id', type: 'int' })
    serviceId: number;

    @Column({ name: 'global_quantity', type: 'int' })
    globalQuantity: number;

    @Column({ name: 'max_peruser_quantity', type: 'int' })
    maxPatientQuantity: number;

    @Column({ name: 'discount', type: 'int' })
    discount: number;

}

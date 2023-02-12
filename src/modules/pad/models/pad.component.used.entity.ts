import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pad_component_used')
export class PadComponentUsedEntity {
    @PrimaryGeneratedColumn({ name: 'ID' })
    id: number;

    @Column({ name: 'patient_id', type: 'int' })
    patientId: number;

    @Column({ name: 'pad_id', type: 'int' })
    padId: number;

    @Column({ name: 'service_id', type: 'int' })
    serviceId: number;;
}
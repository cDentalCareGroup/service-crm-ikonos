import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('patient_organization')
export class PatientOrganizationEntity {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'description', type: 'varchar' })
    description: string;

}
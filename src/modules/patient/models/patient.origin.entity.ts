import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('patient_origin')
export class PatientOriginEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'description', type: 'varchar' })
    description: string;

    @Column({ name: 'referral_code', type: 'varchar' })
    referralCode: string;
}
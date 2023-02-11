import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum PadMemberStatus {
    ACTIVE = 'vigente',
    INACTIVE = 'vencido',
}

@Entity('pad_member')
export class PadMemberEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'pad_catalogue_id', type: 'int' })
    padCatalogueId: number;

    @Column({ name: 'patient_id', type: 'int' })
    patientId: number;


    @Column({ name: 'is_principal', type: 'tinyint' })
    isPrincipal: number;

    @Column({
        name: 'status',
        type: 'enum',
        enum: PadMemberStatus,
        default: PadMemberStatus.ACTIVE
    })
    status: PadMemberStatus;

    @Column({ name: 'pad_id', type: 'int' })
    padId: number;

}


import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum PadType {
    INDIVIDUAL = 'individual',
    GROUP = 'grupal',
}

export const getPadType = (type: string): PadType => {
    if (type.toLowerCase() == 'individual') {
        return PadType.INDIVIDUAL;
    } else {
        return PadType.GROUP;
    }
}


export enum PadStatus {
    ACTIVE = 'activo',
    INACTIVE = 'inactivo',
}

@Entity('pad_catalogue')
export class PadCatalogueEntity {
    @PrimaryGeneratedColumn({ name: 'ID' })
    id: number;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'description', type: 'varchar' })
    description: string;

    @Column({ name: 'price', type: 'decimal' })
    price: number;

    @Column({
        name: 'type',
        type: 'enum',
        enum: PadType,
        default: PadType.INDIVIDUAL
    })
    type: PadType;

    @Column({
        name: 'status',
        type: 'enum',
        enum: PadStatus,
        default: PadStatus.ACTIVE
    })
    status: PadStatus;

    @Column({ name: 'day', type: 'int' })
    day: number;
}

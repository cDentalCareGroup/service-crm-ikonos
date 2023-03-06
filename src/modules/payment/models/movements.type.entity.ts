import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('movements_type')
export class MovementsTypeEntity {
    @PrimaryGeneratedColumn({ name: 'ID' })
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
    })
    name: string;

    @Column({
        name: 'type',
        type: 'varchar',
    })
    type: string;

}
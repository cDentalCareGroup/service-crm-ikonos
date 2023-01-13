import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('municipalities')
export class MunicipalitiesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'state_id', type: 'int' })
    stateId: number;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'created_at', type: 'datetime' })
    created_at: Date;

    @Column({ name: 'updated_at', type: 'datetime' })
    updated_at: Date;

    @Column({ name: 'status', type: 'int' })
    status: number;
}
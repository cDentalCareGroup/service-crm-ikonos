import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('call_catalog')
export class CallCatalogEntity {
    @PrimaryGeneratedColumn({ name: 'ID' })
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
    })
    name: string;

    @Column({
        name: 'description',
        type: 'varchar',
    })
    description: string;

    @Column({
        name: 'script',
        type: 'varchar',
    })
    script: string;

    @Column({
        name: 'goal',
        type: 'varchar',
    })
    goal: string;
}

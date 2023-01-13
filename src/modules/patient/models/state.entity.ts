import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('state')
export class StateEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar' })
    name: string;
}
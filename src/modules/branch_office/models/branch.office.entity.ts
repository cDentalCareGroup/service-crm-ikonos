import { type } from "os";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('branch_office')
export class BranchOffice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 45,
  })
  name: string;

  @Column({
    name: 'address',
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  address: string;

  @Column({ 
    name: 'latitud', 
    type: 'decimal',
    precision: 10, 
    scale: 7,
    nullable: true 
  })
  latitud: number;

  @Column({ 
    name: 'longitud', 
    type: 'decimal',
    precision: 10, 
    scale: 7,
    nullable: true 
  })
  longitud: number;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: false,
    length: 13,
    comment: "telefono fijo a minimo a 10 digitos",
  })
  cellular: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  email: string;

}
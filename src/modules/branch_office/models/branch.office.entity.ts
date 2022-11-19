import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sucursal')
export class BranchOfficeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 255,
  })
  name: string;


  @Column({
    name: 'calle',
    type: 'varchar',
    length: 255,
  })
  street: string;

  @Column({
    name: 'numero',
    type: 'varchar',
    length: 45,
  })
  number: string;


  @Column({
    name: 'colonia',
    type: 'varchar',
    length: 255,
  })
  colony: string;

  @Column({
    name: 'codigo_postal',
    type: 'varchar',
    length: 45,
  })
  cp: string;


  @Column({
    name: 'telefono_principal',
    type: 'varchar',
    length: 45,
  })
  primaryContact: string;

  @Column({
    name: 'telefono_sucursal',
    type: 'varchar',
    length: 45,
  })
  primaryBranchOfficeContact: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    name: 'idEstatusSucursal',
    type: 'int',

  })
  status: number;
}
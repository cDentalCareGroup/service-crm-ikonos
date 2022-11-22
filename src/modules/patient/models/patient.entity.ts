import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('paciente')
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'nombre', type:'varchar', length: 150})
  name: string;

  @Column({name:'paterno', type:'varchar', length: 150})
  lastname: string;

  @Column({name:'materno', type:'varchar', length: 150})
  secondLastname: string;


  @Column({name:'fecha_nacimiento', type:'date',})
  birthDay: Date;

  @Column({name:'genero', type:'varchar', length: 20})
  gender: string;

  @Column({name:'estado_civil', type:'varchar', length: 20})
  maritalStatus: string;

  @Column({name:'ocupacion', type:'varchar', length: 20})
  job: string;

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
    name: 'telefono_particular',
    type: 'varchar',
    length: 45,
  })
  primaryContact: string;

  @Column({
    name: 'telefono_movil',
    type: 'varchar',
    length: 45,
  })
  secondaryContact: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 45,
  })
  email: string;

  @Column({
    name: 'folio',
    type: 'varchar',
    length: 45,
  })
  folio: string;

  @Column({
    name: 'folio_historico',
    type: 'varchar',
    length: 45,
  })
  historicalFolio: string;

  @Column({
    name: 'rfc',
    type: 'varchar',
    length: 45,
  })
  rfc: string;

  @Column({
    name: 'idSucursalOrigen',
    type: 'int',
  })
  originBranchOfficeId: number;

  @Column({
    name: 'idEstatus',
    type: 'int',
  })
  status: number;

}
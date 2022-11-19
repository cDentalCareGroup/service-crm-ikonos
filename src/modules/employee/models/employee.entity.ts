import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('empleado')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 150,
  })
  name: string;

  @Column({
    name: 'paterno',
    type: 'varchar',
    length: 150,
  })
  lastname: string;

  @Column({
    name: 'materno',
    type: 'varchar',
    length: 150,
  })
  secondLastname: string;

  @Column({
    name: 'idEstatus',
    type: 'int',
  })
  status: number;

  @Column({
    name: 'idEstado',
    type: 'int',
  })
  stateId: number;

  @Column({
    name: 'idMunicipio',
    type: 'int',
  })
  municipalityId: number;

  @Column({
    name: 'idEsquemaLaboral',
    type: 'int',
  })
  jobScheme: number;

  @Column({
    name: 'idTipoEmpleado',
    type: 'int',
  })
  typeId: number;

  @Column({
    name: 'idSucursal',
    type: 'int',
  })
  branchOfficeId: number;

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
    length: 10,
  })
  cp: string;

  @Column({
    name: 'telefono_principal',
    type: 'varchar',
    length: 45,
  })
  primaryContact: string;

  @Column({
    name: 'telefono_secundario',
    type: 'varchar',
    length: 45,
  })
  secondaryContact: string;

  @Column({
    name: 'curp',
    type: 'varchar',
    length: 20,
  })
  curp: string;

  @Column({
    name: 'fecha_nacimiento',
    type: 'date',
  })
  birthDay: Date;

  @Column({
    name: 'rfc',
    type: 'varchar',
    length: 20,
  })
  rfc: string;

  @Column({
    name: 'nss',
    type: 'varchar',
    length: 20,
  })
  nss: string;
}

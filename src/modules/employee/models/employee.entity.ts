import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 150,
  })
  name: string;

  @Column({
    name: 'last_name1',
    type: 'varchar',
    length: 150,
  })
  lastname: string;

  @Column({
    name: 'last_name2',
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
    name: 'state_id',
    type: 'int',
  })
  stateId: number;

  @Column({
    name: 'city_id',
    type: 'int',
  })
  municipalityId: number;

  @Column({
    name: 'contract_type_id',
    type: 'int',
  })
  jobScheme: number;

  @Column({
    name: 'employee_type_id',
    type: 'int',
  })
  typeId: number;

  @Column({
    name: 'branch_id',
    type: 'int',
  })
  branchOfficeId: number;

  @Column({
    name: 'street',
    type: 'varchar',
    length: 255,
  })
  street: string;

  @Column({
    name: 'number',
    type: 'varchar',
    length: 45,
  })
  number: string;

  @Column({
    name: 'colony',
    type: 'varchar',
    length: 255,
  })
  colony: string;

  @Column({
    name: 'zip_code',
    type: 'varchar',
    length: 10,
  })
  cp: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 45,
  })
  primaryContact: string;

  // @Column({
  //   name: 'telefono_secundario',
  //   type: 'varchar',
  //   length: 45,
  // })
  // secondaryContact: string;

  // @Column({
  //   name: 'curp',
  //   type: 'varchar',
  //   length: 20,
  // })
  // curp: string;

  @Column({
    name: 'birth_date',
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

  typeName?: string;

  @Column({name:'token', type:'text'})
  token?: string;
}

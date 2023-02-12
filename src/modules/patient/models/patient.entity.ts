import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('patient')
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'name', type:'varchar', length: 150})
  name: string;

  @Column({name:'last_name1', type:'varchar', length: 150})
  lastname: string;

  @Column({name:'last_name2', type:'varchar', length: 150})
  secondLastname: string;


  @Column({name:'birth_date', type:'date',})
  birthDay: Date;

  @Column({name:'sex', type:'varchar', length: 20})
  gender: string;

  @Column({name:'civil_status', type:'varchar', length: 20})
  maritalStatus: string;

  @Column({name:'occupation', type:'varchar', length: 20})
  job: string;

  @Column({
    name: 'street',
    type: 'varchar',
    length: 255,
  })
  street: string;

  @Column({
    name: 'street_number',
    type: 'varchar',
    length: 45,
  })
  number: string;

  // @Column({
  //   name: 'city_id',
  //   type: 'int',
  // })
  // cityId: number;

  // @Column({
  //   name: 'county_id',
  //   type: 'int',
  // })
  // countyId: number;


  @Column({
    name: 'colony',
    type: 'varchar',
    length: 255,
  })
  colony: string;

  @Column({
    name: 'city',
    type: 'varchar',
    length: 255,
  })
  city: string;

  @Column({
    name: 'zip_code',
    type: 'varchar',
    length: 45,
  })
  cp: string;


  @Column({
    name: 'phone',
    type: 'varchar',
    length: 45,
  })
  primaryContact: string;

  // @Column({
  //   name: 'telefono_movil',
  //   type: 'varchar',
  //   length: 45,
  // })
  // secondaryContact: string;

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
    name: 'home_branch_id',
    type: 'int',
  })
  originBranchOfficeId: number;

  @Column({
    name: 'current_branch_id',
    type: 'int',
  })
  currentBranchOfficeId: number;

  
  // FCV 22Nov22 se agregan campos para analisis de datos

  @Column({
    name:     'country',
    type:     'char',
    length:    4,
    comment:  'siglas del estado seleccionado, ej: mor, cdmx, bcs, etc',
  })
  country: string;

  @Column({
    name:     'state',
    type:     'varchar',
    comment:  'siglas del estado seleccionado, ej: mor, cdmx, bcs, etc',
  })
  state: string;

  // @Column({
  //   name:     'state_id',
  //   type:     'int',
   
  //   comment:  'siglas del estado seleccionado, ej: mor, cdmx, bcs, etc',
  // })
  // stateId: number;

  @Column({
    name:       'lat',
    type:       'decimal',
    precision:   10, 
    scale:       8, 
  })
  lat: number;

  @Column({
    name:       'lon',
    type:       'decimal',
    precision:   10, 
    scale:       8, 
  })
  lng: number;


  @Column({
    name:     'status',
    type:     'char',
    length:    10,
    comment:  'ejemplo: activo, perdido, fallecio, noMolestar',
  })
  status: string;

  // @Column({
  //   name:     'idEstatus',
  //   comment:  '1 o 2 o 3',
  // })
  // patientStatus: number;



  @Column({
    name:     'start_date',
    type:     'char',
    comment:  'fecha en la que se atendio el paciente por primera vez en alguna sucursal, no el dia que se capturo',
  })
  startDate: string;


  @Column({
    name:     'patient_origin_id',
    type:     'int',
    comment:  'como se obtuvo este cliente: redes, recomendacion, escolar, convenio',
  })
  sourceClient: number;

  @Column({
    name:     'patient_organization_id',
    type:     'varchar',
    length:    45,
    comment:  'por ejemplo: si es escolar, escuela a la que pertenece, esto nos permite medir la efectvidad de las campañas',
  })
  organizationClient: number;

  @Column({
    name:     'pad',
    type:     'boolean',
    comment:  'tiene pad SI/NO',
  })
  pad: number;

  @Column({
    name:     'current_pad_id',
    type:     'int',
    comment:  'ultimo numero de folio de pad contratado, pudiera ser que ya este vencido',
  })
  currentPadId: number;

  @Column({
    name:     'pad_type',
    type:     'varchar',
    length:    20,
    comment:  'individual, familiar, escolar',
  })
  padType: string;

  @Column({
    name: 'pad_acquisiton_date',
    type: 'char',
  })
  padAcquisitionDate: string;

  @Column({
    name: 'pad_expiration_date',
    type: 'char',
  })
  padExpirationDate: string;

  @Column({
    name:     'pad_acquisition_brach_id',
    type:     'varchar',
    length:    45,
    comment:  'sucursal en la que se adquirio el pado',
  })
  padAcquisitionBranch: number;


  @Column({
    name: 'created_at',
    type: 'datetime'
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime'
  })
  updatedAt: Date;

  @Column({
    name: 'comments',
    type: 'varchar'
  })
  comments: string;

}
import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  
  // FCV 22Nov22 se agregan campos para analisis de datos

  @Column({
    name:     'estado',
    type:     'char',
    length:    4,
    comment:  'siglas del estado seleccionado, ej: mor, cdmx, bcs, etc',
  })
  state: string;

  @Column({
    name:       'latitud',
    type:       'decimal',
    precision:   10, 
    scale:       8, 
  })
  lat: number;

  @Column({
    name:       'longitud',
    type:       'decimal',
    precision:   10, 
    scale:       8, 
  })
  lng: number;

  @Column({
    name: 'fecha_hora_proxima_cita',
    type: 'datetime',
  })
  nextDateAppointment: Date; 

  @Column({
    name:     'estatus',
    type:     'char',
    length:    10,
    comment:  'ejemplo: activo, perdido, fallecio, noMolestar',
  })
  status: string;

  @Column({
    name:     'idEstatus',
    comment:  '1 o 2 o 3',
  })
  patientStatus: number;

  @Column({
    name:     'sucursal_origen',
    type:     'varchar',
    length:    45,
    comment:  'sucursal en la que se atendio por primera vez al paciente',
  })
  sourceBranch: string;

  @Column({
    name:     'sucursal_actual',
    type:     'varchar',
    length:    45,
    comment:  'sucursal en la que se atiende actualmente al paciente',
  })
  currentBranch: string;

  @Column({
    name:     'fecha_inicio',
    type:     'date',
    comment:  'fecha en la que se atendio el paciente por primera vez en alguna sucursal, no el dia que se capturo',
  })
  startDate: Date;

  @Column({
    name:     'fecha_hora_ultima_visita',
    type:     'datetime',
    comment:  'fechaHora en la que se atendio el paciente por ultima vez vez en alguna sucursal',
    default : null
  })
  lastVisitDate: Date;

  @Column({
    name:     'origen_cliente',
    type:     'varchar',
    length:    45,
    comment:  'como se obtuvo este cliente: redes, recomendacion, escolar, convenio',
  })
  sourceClient: string;

  @Column({
    name:     'organizacion_cliente',
    type:     'varchar',
    length:    45,
    comment:  'por ejemplo: si es escolar, escuela a la que pertenece, esto nos permite medir la efectvidad de las campañas',
  })
  organizationClient: string;

  @Column({
    name:     'pad',
    type:     'boolean',
    comment:  'tiene pad SI/NO',
  })
  pad: number;

  @Column({
    name:     'actual_pad_id',
    type:     'int',
    comment:  'ultimo numero de folio de pad contratado, pudiera ser que ya este vencido',
  })
  currentPadId: number;

  @Column({
    name:     'tipo_pad',
    type:     'varchar',
    length:    20,
    comment:  'individual, familiar, escolar',
  })
  padType: string;

  @Column({
    name: 'fecha_adquisicion_pad',
    type: 'date',
  })
  padAcquisitionDate: Date;

  @Column({
    name: 'fecha_expiracion_pad',
    type: 'datetime',
  })
  padExpirationDate: Date;

  @Column({
    name:     'sucursal_adquisicion_pad',
    type:     'varchar',
    length:    45,
    comment:  'sucursal en la que se adquirio el pado',
  })
  padAcquisitionBranch: string;

  @Column({
    name:       'precio_pad',
    type:       'decimal',
    precision:   10, 
    scale:       2, 
    comment:    'precio al que se aquirio el pad',
  })
  padPrice: number;

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

}
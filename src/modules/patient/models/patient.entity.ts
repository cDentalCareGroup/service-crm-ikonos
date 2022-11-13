import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('patient')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
    length: 100,
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
    name: 'colony',
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  colony: string;

  @Column({
    name: 'city',
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  city: string;

  @Column({
    name: 'state',
    type: 'varchar',
    nullable: false,
    length: 4,
    comment: 'iniciales del estado a 3 o 4 digitos'
  })
  state: string;

  @Column({
    name: 'country',
    type: 'varchar',
    nullable: false,
    length: 4,
    default: "MX",
    comment: 'iniciales del pais'
  })
  country: string;

  @Column({
    name: 'zip',
    type: 'varchar',
    nullable: false,
    length: 5,
    comment: 'codigo postal',
  })
  zip: string;

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
    name: 'birth_day',
    type: 'date',
    nullable: false,
  })
  birthDate: Date;

  @Column({
    name: 'sex',
    type: 'varchar',
    nullable: false,
    length: 20,
    comment: "hombre, mujer, indefinio, otro",
  })
  sex: string;

  @Column({
    name: 'cell_code',
    type: 'varchar',
    nullable: false,
    length: 20,
    default: '52',
    comment: "codigo telefonico de pais",
  })
  cellCode: string;

  @Column({
    name: 'cellular',
    type: 'varchar',
    nullable: false,
    length: 20,
    comment: "celular minimo a 10 digitos",
  })
  cellular: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  email: string;

  @Column({
    name: 'next_date_appointment', 
    //type: 'timestamptz',
    type: 'datetime',
    comment: 'fecha hora de la siguiente visita',
  }) 
  nextDateAppointdment: Date;

  @Column({
    name: 'status',
    type: 'char',
    nullable: false,
    length: 10,
    comment: 'activo, suspendido, fallecido',
  })
  status: string;

  @Column({
    name: 'home_branch',
    type: 'varchar',
    nullable: false,
    length: 45,
    comment: "sucursal en la que se atendio por primera vez",
  })
  homeBranch: string;

  @Column({
    name: 'current_branch',
    type: 'varchar',
    nullable: false,   
    length: 45,
    comment: "sucursal en la que se atiende actualmente, puede ser la misma que homeBranch",
  })
  currentBranch: string;

  @Column({
    name: 'start_date',
    type: 'date',
    nullable: false,
    comment: 'fecha en la que se atendio el paciente por primera vez en la red de sucursales',
  })
  startDate: Date;

  @Column({
    name: 'last_visit_date',
    type: 'datetime',
    nullable: false,
    comment: 'fecha en la que se atendio el paciente por primera vez en la red de sucursales',
  })
  lastVisitate: Date;

  @Column({
    name: 'customer_origin',
    type: 'varchar',
    length: 45,
    nullable: false,
    comment: 'de donde viene el cliente: recomendacion, escolar, redes, venta en sucursal, etc'
  })
  customerOrigin: string;

  @Column({
    name: 'pad',
    type: 'boolean',
    nullable: false,
    comment: 'el paciente tiene o no tiene PAD contratado',
  })
  pad: string;

  @Column({
    name: 'pad_type',
    type: 'varchar',
    length: 20,
    comment: 'familiar, individual, escolar',
  })
  pad_type: string;

  @Column({
    name: 'pad_acquisition_date',
    type: 'datetime',
    comment: 'fechaHora de aquisicion del pad si es que tiene',
  })
  padAcquisitonDate: Date;

  @Column({
    name: 'pad_expiration_date',
    type: 'datetime',
    comment: 'fechaHora de vencimiento del pad si es que tiene',
  })
  padExpirationDate: Date;

  @Column({
    name: 'pad_acquisition_branch',
    type: 'varchar',
    length: 45,
    comment: "sucursal en la que se adquirio el pad si es que tiene",
  })
  padAcquisitionBranch: string;

  @Column({ 
    name: 'pad_cost', 
    type: 'decimal',
    precision: 10, 
    scale: 2,
    nullable: true 
  })
  padCost: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
    comment: 'fechaHora en la que se capturo el paciente en el sistema'
  })
  createdAt: Date;

}
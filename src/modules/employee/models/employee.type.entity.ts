import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
  } from 'typeorm';
  
  @Entity('tipo_empleado')
  export class EmployeeTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name : 'nombre', type:'varchar', length: 150})
    name: string;
  
    @Column({name : 'descripcion', type:'varchar', length: 255, nullable: true})
    description: string;
  
  }
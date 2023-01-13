import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
  } from 'typeorm';
  
  @Entity('employee_type')
  export class EmployeeTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name : 'name', type:'varchar', length: 150})
    name: string;
  
    @Column({name : 'description', type:'varchar', length: 255, nullable: true})
    description: string;
  
  }
import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
  } from 'typeorm';
  
  @Entity('rol')
  export class RolEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name : 'name', type:'varchar', length: 150})
    name: string;
  
    @Column({name : 'description', type:'varchar', length: 255, nullable: true})
    description: string;
  
    @Column({name : 'order', type:'tinyint'})
    order: number;
  }

  @Entity('employee_role')
  export class UserRolEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name : 'idRol', type:'int'})
    rolId: number;
  
    @Column({name : 'idEmployee', type:'int'})
    userId: number;
  }

  export class Rol {
    id: number;
    name: string;

    constructor(id: number, name: string){
      this.id = id;
      this.name = name;
    }
  }

  
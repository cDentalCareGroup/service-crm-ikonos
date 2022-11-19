import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
  } from 'typeorm';
  
  @Entity('rol')
  export class RolEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name : 'nombre', type:'varchar', length: 150})
    name: string;
  
    @Column({name : 'descripcion', type:'varchar', length: 255, nullable: true})
    description: string;
  
    @Column({name : 'orden', type:'tinyint'})
    order: number;
  }

  @Entity('empleado_rol')
  export class UserRolEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name : 'idRol', type:'int'})
    rolId: number;
  
    @Column({name : 'idEmpleado', type:'int'})
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

  
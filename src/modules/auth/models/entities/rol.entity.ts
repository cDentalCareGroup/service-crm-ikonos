import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
  } from 'typeorm';
  
  @Entity('rol')
  export class Rol {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name : 'nombre', type:'varchar', length: 150})
    name: string;
  
    @Column({name : 'descripcion', type:'varchar', length: 255, nullable: true})
    description: string;
  
    @Column({name : 'orden', type:'tinyint'})
    order: number;
  }

  
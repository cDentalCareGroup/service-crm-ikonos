import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('employees')
export class Employees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'license',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  license: string;

  @Column({ 
    name: 'cellular',
    type: 'varchar',
    length: 13,
    nullable: false,
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
    name: 'category',
    type: 'varchar',
    nullable: false,
    length: 20,
    comment: 'tipo de empleado: dentista, rececionista, admin, etc',
  })
  type: string;
}
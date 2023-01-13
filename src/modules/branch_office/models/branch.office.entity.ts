import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('branch')
export class BranchOfficeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;


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
    length: 45,
  })
  cp: string;


  @Column({
    name: 'phone_branch',
    type: 'varchar',
    length: 45,
  })
  primaryContact: string;

  @Column({
    name: 'cel_branch',
    type: 'varchar',
    length: 45,
  })
  primaryBranchOfficeContact: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    name: 'idStatusBranch',
    type: 'int',

  })
  status: number;

  @Column({
    name: 'lat',
  })
  lat: number;
  @Column({
    name: 'lon',
  })
  lng: number;

  appointmens?: number;
}
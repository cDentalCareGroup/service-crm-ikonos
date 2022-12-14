import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

 @Entity('prospect')
 export class ProspectEntity {
  @PrimaryGeneratedColumn({name:'ID'})
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;
  @Column({
    name: 'cellphone',
    type: 'varchar',
  })
  primaryContact: string;
  @Column({
    name: 'email',
    type: 'varchar',
  })
  email: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
}
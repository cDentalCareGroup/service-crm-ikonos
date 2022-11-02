import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('calls')
export class Calls {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  callDate: Date;

  @Column()
  reason: string;

  @Column({ name: 'contact_method' })
  contactMethod: string;

  @Column()
  comments: string;
}
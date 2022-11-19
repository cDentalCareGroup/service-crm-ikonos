import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('empleado')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'usuario', type:'varchar', length: 45})
  username: string;

  @Column({name:'contrasena', type:'varchar', length: 45})
  password: string;

  @Column({name:'nombre', type:'varchar', length: 150})
  name: string;

  @Column({name:'paterno', type:'varchar', length: 150})
  lastname: string;

  @Column({name:'materno', type:'varchar', length: 150})
  secondLastname: string;
}

export class UserResponse {
  name: string;
  lastname: string;
  username: string;
  token: string;
  constructor(user: User, token: string) {
    this.name = user.name;
    this.lastname = user.lastname + ' ' + user.secondLastname;
    this.username = user.username;
    this.token = token;
  }
}



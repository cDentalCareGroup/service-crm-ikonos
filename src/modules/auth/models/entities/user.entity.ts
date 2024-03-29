import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm';
import { Rol } from './rol.entity';

@Entity('employee')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'user', type:'varchar', length: 45})
  username: string;

  @Column({name:'password', type:'varchar', length: 45})
  password: string;

  @Column({name:'name', type:'varchar', length: 150})
  name: string;

  @Column({name:'last_name1', type:'varchar', length: 150})
  lastname: string;

  @Column({name:'last_name2', type:'varchar', length: 150})
  secondLastname: string;

  @Column({name:'token', type:'text'})
  token?: string;

  @Column({name:'branch_id', type:'int'})
  branchId?: number;
}

export class UserResponse {
  name: string;
  lastname: string;
  username: string;
  token: string;
  roles?: string;
  branchId?: number;
  constructor(user: UserEntity, token: string, roles?: Rol[]) {
    this.name = user.name;
    this.lastname = user.lastname + ' ' + user.secondLastname;
    this.username = user.username;
    this.token = token;
    let rolesStr = '';
    for (let index = 0; index < roles.length; index++) {
      const element = roles[index];
      if(index != roles.length) {
        rolesStr+=`${element.name},`;
      } else {
        rolesStr+=`${element.name}`;
      }
    }
    this.roles = rolesStr;
    this.branchId = user.branchId;
  }
}



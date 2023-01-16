import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('employee_role')
export class EmployeeRoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'idEmployee',
        type: 'int',
    })
    employeeId: number;

    @Column({
        name: 'idRol',
        type: 'int',
    })
    roleId: number;
}
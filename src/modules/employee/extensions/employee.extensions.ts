import { BranchOfficeEmployeeSchedule } from "src/modules/branch_office/models/branch.office.employee.entity";
import { RegisterScheduleeEmployeeDTO, RegisterScheduleesEmployeesDTO } from "../models/employee.dto";
import { EmployeeEntity } from "../models/employee.entity";



const registerScheduleEmployeeToEntity = (element: RegisterScheduleeEmployeeDTO): BranchOfficeEmployeeSchedule => {
    const entity = new BranchOfficeEmployeeSchedule();
    entity.branchId = element.branchId;
    entity.employeeId = element.employeeId;
    entity.branchScheduleId = element.scheduleId;
    return entity;
}




const employeeQueryToEntity = (data: any): EmployeeEntity => {
    const employee = new EmployeeEntity();
    employee.id = data.empleado_id;
    employee.name = data.empleado_nombre;
    employee.lastname = data.empleado_paterno;
    employee.secondLastname = data.empleado_materno;
    employee.status = data.empleado_idEstatus;
    //employee.stateId = data.empleado_idEstado;
    //employee.municipalityId = data.empleado_idMunicipio;
    employee.jobScheme = data.empleado_idEsquemaLaboral;
    employee.typeId = data.empleado_idTipoEmpleado;
    employee.branchOfficeId = data.empleado_idSucursal;
    employee.street = data.empleado_calle;
    employee.number = data.empleado_numero;
    employee.colony = data.empleado_colonia;
    employee.cp = data.empleado_codigo_postal;
    employee.primaryContact = data.empleado_telefono_principal;
   // employee.secondaryContact = data.empleado_telefono_secundario;
   // employee.curp = data.empleado_curp;
    employee.birthDay = data.empleado_fecha_nacimiento;
    employee.rfc = data.empleado_rfc;
    employee.nss = data.empleado_nss;
    return employee;
  }

export {registerScheduleEmployeeToEntity, employeeQueryToEntity};
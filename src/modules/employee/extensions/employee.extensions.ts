import { BranchOfficeEmployeeSchedule } from "src/modules/branch_office/models/branch.office.employee.entity";
import { RegisterScheduleeEmployeeDTO, RegisterScheduleesEmployeesDTO } from "../models/employee.dto";



const registerScheduleEmployeeToEntity = (element: RegisterScheduleeEmployeeDTO): BranchOfficeEmployeeSchedule => {
    const entity = new BranchOfficeEmployeeSchedule();
    entity.branchId = element.branchId;
    entity.employeeId = element.employeeId;
    entity.branchScheduleId = element.scheduleId;
    return entity;
}
export {registerScheduleEmployeeToEntity};
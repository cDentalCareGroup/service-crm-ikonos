import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { async } from 'rxjs';
import { HandleException } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { PatientEntity } from '../patient/models/patient.entity';

@Injectable()
export class StatisticService {
    constructor(
        @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
        @InjectRepository(PatientEntity) private patientsRepository: Repository<PatientEntity>,
        @InjectRepository(EmployeeEntity) private employeeRepository: Repository<EmployeeEntity>,

      ) {}


    getGeneralStatistics = async () => {
        try {
            const branchOffices = await this.branchOfficeRepository.count({where: { status: 1 }});
            console.log("Offices", branchOffices);

            const patients = await this.patientsRepository.find();
            const activePatients = patients.filter((value, _) => value.patientStatus == 1).length;
            const suspendPatients = patients.filter((value, _) => value.patientStatus == 2).length;
            const inactivePatients = patients.filter((value, _) => value.patientStatus == 3).length;

            console.log("Active", activePatients);
            console.log("Inactive", inactivePatients);
            console.log("Suspend", suspendPatients);


            const employees = await this.employeeRepository.find({where:{status: 1}});

            const dentalDoctor = employees.filter((value, _) => value.typeId == 11).length;
            const axuDentalDoctor = employees.filter((value, _) => value.typeId == 12).length;

            console.log("Dental", dentalDoctor);
            console.log("Aux", axuDentalDoctor);

            const dates = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                dates.push({
                    'date':date.toLocaleDateString(),
                    'active': i + randomInt(10),
                    'cancelled': i + randomInt(5),
                    'inProgress': i + randomInt(7),
                });
              }
              console.table(dates);

              return {
                'branch_offices': branchOffices,
                'patients': {
                    'active':activePatients,
                    'inactive': inactivePatients,
                    'suspend':suspendPatients
                },
                'employees':{
                    'dental_doctor': dentalDoctor,
                    'aux_dental_doctor': axuDentalDoctor,
                },
                'dates': dates
                          }

        } catch (exception) {
            HandleException.exception(exception);
        }
    }
}

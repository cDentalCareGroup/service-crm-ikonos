import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HandleException,
  NotFoundCustomException,
  NotFoundType,
} from 'src/common/exceptions/general.exception';
import { isNumber } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { BranchOffice } from '../branch_office/models/branch.office.entity';
import { GetPatientsByBranchOfficeDTO } from './models/patient.dto';
import { Patient } from './models/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(BranchOffice)
    private branchOfficeRepository: Repository<BranchOffice>,
  ) {}

  getAllPatients = async (): Promise<Patient[]> => {
    try {
      const results = await this.patientRepository.find();
      return results;
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  getPatientsByBranchOffice = async ({
    branchOffice,
  }: GetPatientsByBranchOfficeDTO): Promise<Patient[]> => {
    try {
      let results: Patient[] = [];

      if (isNumber(branchOffice)) {
        results = await this.patientRepository.find({
          where: { originBranchOfficeId: Number(branchOffice) },
        });
      } else {
        const office = await this.branchOfficeRepository.findOneBy({
          name: branchOffice.toString(),
        });
        if (office != null) {
          results = await this.patientRepository.find({
            where: { originBranchOfficeId: office.id },
          });
        } else {
          throw new NotFoundCustomException(NotFoundType.BRANCH_OFFICE);
        }
      }
      return results;
    } catch (exception) {
      HandleException.exception(exception);
    }
  };
}

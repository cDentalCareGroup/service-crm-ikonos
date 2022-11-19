import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HandleException,
  NotFoundCustomException,
  NotFoundType,
} from 'src/common/exceptions/general.exception';
import { isNumber } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { GetPatientsByBranchOfficeDTO } from './models/patient.dto';
import { PatientEntity } from './models/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
    @InjectRepository(BranchOfficeEntity)
    private branchOfficeRepository: Repository<BranchOfficeEntity>,
  ) {}

  getAllPatients = async (): Promise<PatientEntity[]> => {
    try {
      const results = await this.patientRepository.find();
      return results;
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  getPatientsByBranchOffice = async ({
    branchOffice,
  }: GetPatientsByBranchOfficeDTO): Promise<PatientEntity[]> => {
    try {
      let results: PatientEntity[] = [];

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

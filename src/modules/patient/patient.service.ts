import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { Patient } from './models/patient.entity';

@Injectable()
export class PatientService {
  // constructor(
  //   @InjectRepository(Patient) private patientRepository: Repository<Patient>,
  // ) {}

  // getPatientsByFilter = async (query: any): Promise<Patient[]> => {
  //   try {
  //     let results: Patient[] = [];
  //     if (query != null && query != '') {
  //       results = await this.patientRepository.find({
  //         where: { currentBranch: query },
  //       });
  //     } else {
  //       results = await this.patientRepository.find();
  //     }
  //     return results;
  //   } catch (exception) {
  //     HandleException.exception(exception);
  //   }
  // };
}

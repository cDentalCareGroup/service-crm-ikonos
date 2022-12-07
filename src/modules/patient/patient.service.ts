import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HandleException,
  NotFoundCustomException,
  NotFoundType,
  ValidationException,
  ValidationExceptionType,
} from 'src/common/exceptions/general.exception';
import { isNumber } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import {
  GetPatientsByBranchOfficeDTO,
  GetPatientsByFilterDTO,
} from './models/patient.dto';
import { PatientEntity } from './models/patient.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { GetPatientsByFilter } from './models/get.patients.by.filter';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(BranchOfficeEntity)
    private branchOfficeRepository: Repository<BranchOfficeEntity>,
    private http: HttpService,
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
      if (branchOffice == null || branchOffice == '')
        throw new ValidationException(ValidationExceptionType.MISSING_VALUES);

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

      //await this.getLatLngFromPostalCode();
      return results.filter((value, index) => value.id < 26);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  };

  private getLatLngFromPostalCode = async (): Promise<any> => {
    try {
      const API_KEY = process.env.GOOGLE_API_KEY;
      const CP = 62158;
      const COUNTRY = 'MX';

      const request = this.http
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${CP}|country:${COUNTRY}&key=${API_KEY}`,
        )
        .pipe(map((res) => res.data.results))
        .pipe(catchError(() => null));
      const response = await lastValueFrom(request);
      if (
        response != null &&
        (response as Array<any>) != null &&
        (response as Array<any>).length > 0
      ) {
        const address = (response as Array<any>)[0];
        return {
          lat: address.geometry.location.lat,
          lng: address.geometry.location.lng,
          address: address.formatted_address,
        };
      }

      return { lat: 0, lng: 0, address: 'EMPTY' };
    } catch (exception) {
      console.log(exception);
      return { lat: 0, lng: 0, address: 'EMPTY' };
    }
  };

  getPatientsByFilter = async ({query}: GetPatientsByFilterDTO): Promise<PatientEntity[]> => {
    try {

      let results: PatientEntity[] = [];
      if (query == 1 || query == "1" || query == 2 || query == "2") {
        const pad = (query == 1 || query == "1") ? 1 : 0
        results = await this.patientRepository.find({
          where: { pad: pad },
        });
      }

      if (query == 4 || query == "4") {
        results = await this.patientRepository.find();
      }

      if (query == 5 || query == "5" || query == 3 || query == "3") {
        const status = (query == 5 || query == "5") ? 'activo' : 'abandono'
        results = await this.patientRepository.find({where: { status: status }});
      }

      if (query == 6 || query == "6" || query == 7 || query == "7") {
        const gender = (query == 6 || query == "6") ? 'masculino' : 'femenino'
        results = await this.patientRepository.find({where: {gender: gender }});
      }
    
      return results;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  };
}

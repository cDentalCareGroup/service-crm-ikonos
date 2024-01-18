import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatISO } from 'date-fns';
import { lastValueFrom, map } from 'rxjs';
import {
  HandleException,
  NotFoundCustomException,
  NotFoundType,
  ValidationException,
  ValidationExceptionType,
} from 'src/common/exceptions/general.exception';
import { capitalizeAllCharacters, isNumber, STATUS_ABANDOMENT, STATUS_ACTIVE, STATUS_INACTIVE, STATUS_DISABLED } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../appointment/models/service.entity';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { PadCatalogueEntity } from '../pad/models/pad.catalogue.entity';
import { PadComponenEntity } from '../pad/models/pad.component.entity';
import { PadEntity } from '../pad/models/pad.entity';
import { PadMemberEntity } from '../pad/models/pad.member.entity';
import {
  GetPatientByIdDTO,
  GetPatientsByBranchOfficeDTO,
  GetPatientsByFilterDTO,
  RegisterPatientDTO,
  UpdatePatientDTO,
  UpdatePatientStatus,
} from './models/patient.dto';
import { PatientEntity } from './models/patient.entity';
import { PatientOrganizationEntity } from './models/patient.organization.entity';
import { PatientOriginEntity } from './models/patient.origin.entity';


@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
    @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
    @InjectRepository(PatientOriginEntity) private patientOriginRepository: Repository<PatientOriginEntity>,
    @InjectRepository(PatientOrganizationEntity) private patientOrganizationRepository: Repository<PatientOrganizationEntity>,
    @InjectRepository(PadEntity) private padRepository: Repository<PadEntity>,
    @InjectRepository(PadMemberEntity) private padMemberRepository: Repository<PadMemberEntity>,
    @InjectRepository(PadCatalogueEntity) private padCatalogRepository: Repository<PadCatalogueEntity>,
    @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(PadComponenEntity) private padComponentRepository: Repository<PadComponenEntity>,
    private readonly httpService: HttpService
  ) { }

  getPatientsByStatus = async (status: string): Promise<PatientEntity[]> => {
    try {
      let results: PatientEntity[] = [];
      switch (status) {
        case STATUS_ACTIVE:
          results = await this.patientRepository.find({
            where: { status: STATUS_ACTIVE },
          });
          break;
        case STATUS_INACTIVE:
          results = await this.patientRepository.find({
            where: { status: STATUS_INACTIVE },
          });
          break;
        case STATUS_DISABLED:
          results = await this.patientRepository.find({
            where: { status: STATUS_DISABLED },
          });
          break;
        default:
          throw new Error('Estado no válido');
      }
      return results;
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

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
      return results;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  };

  // private getLatLngFromPostalCode = async (): Promise<any> => {
  //   try {
  //     const API_KEY = process.env.GOOGLE_API_KEY;
  //     const CP = 62158;
  //     const COUNTRY = 'MX';

  //     const request = this.http
  //       .get(
  //         `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${CP}|country:${COUNTRY}&key=${API_KEY}`,
  //       )
  //       .pipe(map((res) => res.data.results))
  //       .pipe(catchError(() => null));
  //     const response = await lastValueFrom(request);
  //     if (
  //       response != null &&
  //       (response as Array<any>) != null &&
  //       (response as Array<any>).length > 0
  //     ) {
  //       const address = (response as Array<any>)[0];
  //       return {
  //         lat: address.geometry.location.lat,
  //         lng: address.geometry.location.lng,
  //         address: address.formatted_address,
  //       };
  //     }

  //     return { lat: 0, lng: 0, address: 'EMPTY' };
  //   } catch (exception) {
  //     console.log(exception);
  //     return { lat: 0, lng: 0, address: 'EMPTY' };
  //   }
  // };

  getPatientsByFilter = async ({ queries }: GetPatientsByFilterDTO): Promise<PatientEntity[]> => {
    try {
      let results: PatientEntity[] = [];
      for await (const query of queries) {
        if (query == 100 || query == "100" || query == 200 || query == "200") {
          const pad = (query == 100 || query == "100") ? 1 : 0
          const data = await this.patientRepository.find({
            where: { pad: pad },
          });
          results = results.concat(data);
        }

        if (query == 400 || query == "400") {
          const data = await this.patientRepository.find();
          results = results.concat(data);
        }

        if (query == 500 || query == "500" || query == 300 || query == "300") {
          const status = (query == 500 || query == "500") ? STATUS_ACTIVE : STATUS_ABANDOMENT
          const data = await this.patientRepository.find({ where: { status: status } });
          results = results.concat(data);
        }

        if (query == 600 || query == "600" || query == 700 || query == "700") {
          const gender = (query == 600 || query == "600") ? 'masculino' : 'femenino'
          const data = await this.patientRepository.find({ where: { gender: gender } });
          results = results.concat(data);
        }
      }

      return this.removeDuplicates(results);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  };

  removeDuplicates = (arr: any[]): PatientEntity[] => {
    return arr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
  }


  registerPatient = async (body: RegisterPatientDTO) => {
    try {

      const exists = await this.patientRepository.findOneBy({ name: capitalizeAllCharacters(body.name), lastname: capitalizeAllCharacters(body.lastname), secondLastname: capitalizeAllCharacters(body.secondLastname) });
      if (exists) {
        throw new ValidationException(ValidationExceptionType.PATIENT_EXISTS);
      }

      const patient = new PatientEntity();
      patient.name = capitalizeAllCharacters(body.name);
      patient.lastname = capitalizeAllCharacters(body.lastname);
      patient.secondLastname = capitalizeAllCharacters(body.secondLastname);
      patient.birthDay = new Date(body.birthDate);
      patient.gender = body.gender;
      patient.maritalStatus = body.civilStatus;
      patient.street = capitalizeAllCharacters(body.street);
      patient.number = body.streetNumber;
      patient.colony = capitalizeAllCharacters(body.colony);
      patient.cp = body.zipCode;
      patient.primaryContact = body.phone;
      patient.secondaryContact = body.secondPhone;
      patient.email = body.email;
      patient.originBranchOfficeId = body.branchOfficeId;
      patient.currentBranchOfficeId = body.branchOfficeId;
      patient.country = 'MX';
      patient.state = capitalizeAllCharacters(body.state);
      patient.lat = body.lat;
      patient.lng = body.lon;
      patient.sourceClient = body.originId;
      patient.job = body.occupation;
      patient.city = capitalizeAllCharacters(body.city);
      patient.organizationClient = body.organization;
      patient.startDate = formatISO(new Date());
      patient.comments = `Paciente Registrado ${formatISO(new Date())}`
      patient.historicalFolio = body.folio;
      patient.status = STATUS_ACTIVE;

      return await this.patientRepository.save(patient);
    } catch (error) {
      console.log(error);
      HandleException.exception(error);
    }
  }

  updatePatient = async (body: UpdatePatientDTO) => {
    try {
      const patient = await this.patientRepository.findOneBy({ id: body.patientId });
      if (patient != null && patient != undefined) {
        patient.name = capitalizeAllCharacters(body.name);
        patient.lastname = capitalizeAllCharacters(body.lastname);
        patient.secondLastname = capitalizeAllCharacters(body.secondLastname);
        patient.birthDay = new Date(body.birthDate);
        patient.gender = body.gender;
        patient.maritalStatus = body.civilStatus;
        patient.street = capitalizeAllCharacters(body.street);
        patient.number = body.streetNumber;
        patient.colony = capitalizeAllCharacters(body.colony);
        patient.cp = body.zipCode;
        patient.primaryContact = body.phone;
        patient.secondaryContact = body.secondPhone;
        patient.email = body.email;
        patient.originBranchOfficeId = body.branchOfficeId;
        patient.country = 'MX';
        patient.state = capitalizeAllCharacters(body.state);
        patient.lat = body.lat;
        patient.lng = body.lon;
        patient.job = body.occupation;
        patient.sourceClient = body.originId;
        patient.city = capitalizeAllCharacters(body.city);
        patient.organizationClient = body.organization;
        patient.startDate = body.startDate;
        patient.updatedAt = new Date();
        patient.comments = `${patient.comments} \n Paciente Actualizado ${formatISO(new Date())}`
        patient.historicalFolio = body.folio;
        return await this.patientRepository.save(patient);
      }
      return 200;
    } catch (error) {
      console.log(error);
      HandleException.exception(error);
    }
  }

  getPatientsOrigin = async (): Promise<PatientOriginEntity[]> => {
    try {
      const result = await this.patientOriginRepository.find();
      return result;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }

  updatePatientStatus = async (body: UpdatePatientStatus): Promise<any> => {
    try {
      const result = await this.patientRepository.findOneBy({ id: Number(body.patientId) });
      result.status = body.status;
      result.comments = `${result.comments} \n Cambio de Estatus de  ${result.status} a ${body.status}`;
      return await this.patientRepository.save(result);
    } catch (exception) {
      HandleException.exception(exception);
    }
  }

  getPatientById = async (body: GetPatientByIdDTO): Promise<any> => {
    try {
      const result = await this.patientRepository.findOneBy({ id: Number(body.patientId) });
      const padMember = await this.padMemberRepository.findOneBy({ patientId: result.id });

      if (result.pad != null && result.pad == 1 && padMember != null) {

        const pad = await this.padRepository.findOneBy({ id: padMember.padId });
        const padCatalogue = await this.padCatalogRepository.findOneBy({ id: pad.padCatalogueId });

        const padComponents = await this.padComponentRepository.findBy({ padCatalogueId: padCatalogue.id });
        const services = [];
        for await (const component of padComponents) {
          const service = await this.serviceRepository.findOneBy({ id: component.serviceId });
          services.push({
            'service': service,
            'component': component
          })
        }

        const padData = {
          'pad': pad,
          'padCatalog': padCatalogue,
          'component': services
        }
        return {
          'patient': result,
          'pad': padData
        }
      }

      return {
        'patient': result,
        'pad': null
      }
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }

  getColoniesFromPostalCode = async (body: GetColoniesDTO) => {
    try {
      const request = this.httpService
        .get(
          `https://www.walmart.com.mx/api/wmx/service/v1/common/neighborhood/details?zipcode=${body.cp}&channel=4&shipping=1`,
        )
        .pipe(map((res) => res.data))
      const response = await lastValueFrom(request);
      return response
    } catch (error) {
      HandleException.exception(error);
    }
  }

  getPatientOrganizations = async () => {
    try {
      const result = await this.patientOrganizationRepository.find();
      return result;
    } catch (error) {
      console.log(`getPatientOrganizations ${error}`)
      HandleException.exception(error);
    }
  }

  updateLatLng = async (body: UpdateLatLngDTO) => {
    try {
      const patient = await this.patientRepository.findOneBy({ id: body.patientId });
      if (patient != null) {
        patient.lat = body.lat;
        patient.lng = body.lng;
        patient.comments = `${patient.comments} \n Actualización de coordenadas del paciente`;
        await this.patientRepository.save(patient);
      }
      return 200;
    } catch (error) {
      console.log(`updateLatLng ${error}`)
      HandleException.exception(error);
    }
  }
}

export class GetColoniesDTO {
  cp: string;
}


export class UpdateLatLngDTO {
  lat: number;
  lng: number;
  patientId: number;
}

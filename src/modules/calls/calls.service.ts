import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { HandleException } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { CallCatalogEntity } from './models/call.catalog.entity';
import { GetCallsDTO, RegisterCatalogDTO, UpdateCallDTO, UpdateCatalogDTO } from './models/call.dto';
import { CallEntity } from './models/call.entity';

@Injectable()
export class CallsService {


    constructor(
        @InjectRepository(CallEntity) private callRepository: Repository<CallEntity>,
        @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
        @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
        @InjectRepository(CallCatalogEntity) private catalogRepository: Repository<CallCatalogEntity>,

    ) { }

    getCalls = async () => {
        try {
            const result = await this.callRepository.findBy({ status: 'activa' });
            let data: GetCallsDTO[] = [];
            for await (const call of result) {
                const patient = await this.patientRepository.findOneBy({ id: call.patientId });
                const appintment = await this.appointmentRepository.findOneBy({ id: call.appointmentId });
                const catalog = await this.catalogRepository.findOneBy({ id: call.caltalogId });
                data.push(new GetCallsDTO(call, patient, catalog, appintment));
            }
            return data;
        } catch (error) {
            HandleException.exception(error);
        }
    }

    getCatalos = async () => {
        try {
            const result = await this.catalogRepository.find();
            return result;
        } catch (error) {
            HandleException.exception(error);
        }
    }

    updateCall = async ({ id, description }: UpdateCallDTO) => {
        try {
            const result = await this.callRepository.findOneBy({ id: id });
            result.status = 'resuelta';
            result.description = description;
            result.effectiveDate = new Date();
            result.comments = `LLamada resuelta por call center - ${new Date()}`;
            return await this.callRepository.save(result);
        } catch (error) {
            HandleException.exception(error);
        }
    }

    updateCatalog = async ({ id, description, goal, script, name }: UpdateCatalogDTO) => {
        try {
            const catalog = await this.catalogRepository.findOneBy({ id: id });
            catalog.name = name;
            catalog.description = description;
            catalog.goal = goal;
            catalog.script = script;
            return await this.catalogRepository.save(catalog);
        } catch (error) {
            HandleException.exception(error);
        }
    }

    registerCatalog = async ({ name, description, goal, script }: RegisterCatalogDTO) => {
        try {
            const catalog = new CallCatalogEntity();
            catalog.name = name;
            catalog.description = description;
            catalog.goal = goal;
            catalog.script = script;
            return await this.catalogRepository.save(catalog);
        } catch (error) {
            HandleException.exception(error);
        }
    }
}

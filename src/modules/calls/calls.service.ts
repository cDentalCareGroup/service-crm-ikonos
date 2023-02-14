import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { HandleException } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { ProspectEntity } from '../appointment/models/prospect.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { CallCatalogEntity } from './models/call.catalog.entity';
import { GetCallDetailDTO, GetCallsDTO, RegisterCallDTO, RegisterCatalogDTO, UpdateCallDTO, UpdateCatalogDTO } from './models/call.dto';
import { CallEntity, CallResult } from './models/call.entity';

@Injectable()
export class CallsService {


    constructor(
        @InjectRepository(CallEntity) private callRepository: Repository<CallEntity>,
        @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
        @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
        @InjectRepository(CallCatalogEntity) private catalogRepository: Repository<CallCatalogEntity>,
        @InjectRepository(ProspectEntity) private prospectRepository: Repository<ProspectEntity>,

    ) { }

    getCalls = async () => {
        try {
            const result = await this.callRepository.find({ order: { dueDate: { direction: 'ASC' } }, where: { status: 'activa' } });
            let data: GetCallsDTO[] = [];
            for await (const call of result) {
                let patient: PatientEntity;
                let prospect: ProspectEntity;
                if (call.patientId != null && call.patientId != undefined && call.patientId != 0) {
                    patient = await this.patientRepository.findOneBy({ id: call.patientId });
                } else {
                    prospect = await this.prospectRepository.findOneBy({ id: call.prospectId });
                }
                const appintment = await this.appointmentRepository.findOneBy({ id: call.appointmentId });
                const catalog = await this.catalogRepository.findOneBy({ id: call.caltalogId });
                data.push(new GetCallsDTO(call, catalog, appintment, patient, prospect));
            }
            return data
        } catch (error) {
            console.log(error);
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
            result.effectiveDate = new Date();
            result.comments = `${result?.comments ?? '-'} \n ${description}`;
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

    registerCall = async ({ patientId, description, date, type }: RegisterCallDTO) => {
        try {
            const call = new CallEntity();
            call.patientId = patientId;
            call.description = description;
            call.dueDate = new Date(date);
            call.caltalogId = Number(type);
            call.status = 'activa';
            call.result = CallResult.CALL;
            return await this.callRepository.save(call);
        } catch (error) {
            HandleException.exception(error);
        }
    }

    getCallDetail = async ({ patientId, prospectId }: GetCallDetailDTO) => {
        try {

            if (patientId != null && patientId != 0) {
                const patient = await this.patientRepository.findOneBy({ id: patientId });
                const calls = await this.callRepository.findBy({ patientId: patient.id });
                let data: any[] = [];
                for await (const item of calls) {
                    const catalog = await this.catalogRepository.findOneBy({ id: item.caltalogId });
                    data.push({
                        'catalogName': catalog.name,
                        'catalogId': catalog.id,
                        'callId': item.id,
                        'callDueDate': item.dueDate,
                        'appointment': item.appointmentId,
                        'callStatus': item.status,
                    })
                }
                return data;
            }
        } catch (error) {
            HandleException.exception(error);
        }
    }
}


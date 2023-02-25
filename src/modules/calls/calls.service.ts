import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { HandleException } from 'src/common/exceptions/general.exception';
import { capitalizeAllCharacters, getTodayDate } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { AppointmentService } from '../appointment/appointment.service';
import { AppointmentDetailDTO, GetAppointmentDetailDTO } from '../appointment/models/appointment.dto';
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
        private readonly appointmentService: AppointmentService
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
            // result.status = 'resuelta';
            result.effectiveDate = getTodayDate()
            result.comments = `${result?.comments ?? '-'} \n ${description}`;

            if (result.callComments == null || result.callComments == '') {
                result.callComments = `- ${description}`;
            } else {
                result.callComments = `${result.callComments} - ${description}`;
            }
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

    registerCall = async ({ patientId, description, date, type, name, phone, email, prospectId, callId }: RegisterCallDTO) => {
        try {
            console.log(patientId)
            console.log(prospectId);
            console.log(callId);
            const call = new CallEntity();
            if (name != null && name != '' && phone != null && phone != '') {
                const prospect = new ProspectEntity();
                prospect.name = capitalizeAllCharacters(name);
                prospect.email = email;
                prospect.primaryContact = phone;
                prospect.createdAt = new Date();
                const newProspect = await this.prospectRepository.save(prospect);
                call.prospectId = newProspect.id;
            } else if (patientId != null && patientId > 0) {
                call.patientId = patientId;
            } else {
                call.prospectId = prospectId;
            }
            call.description = description;
            call.dueDate = date;
            call.caltalogId = Number(type);
            call.status = 'activa';
            call.result = CallResult.CALL;

            if (callId != null && callId != undefined && callId > 0) {
                const resolvedCall = await this.callRepository.findOneBy({ id: callId });
                if (resolvedCall != null && resolvedCall != undefined) {
                    resolvedCall.status = 'resuelta';
                    resolvedCall.effectiveDate = getTodayDate()
                    resolvedCall.comments = `${resolvedCall?.comments ?? '-'} \n Llamada resuelta ${new Date()} terminada con llamada`;
                    await this.callRepository.save(resolvedCall);
                }
            }

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
                const appointments = await this.appointmentRepository.findBy({ patientId: patient.id });

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
                        'description': item.description
                    })
                }

                let appointmentData: GetAppointmentDetailDTO[] = [];
                for await (const item of appointments) {
                    const element = await this.appointmentService.getAppointment(item);
                    appointmentData.push(element);
                }
                return {
                    'calls': data,
                    'appointments': appointmentData
                }
            }
        } catch (error) {
            HandleException.exception(error);
        }
    }


    updateNotAttendedCall = async ({ id, description }: UpdateCallDTO) => {
        try {
            const result = await this.callRepository.findOneBy({ id: id });
            // result.status = 'resuelta';
            result.comments = `${result?.comments ?? '-'} \n ${description}`;

            if (result.callComments == null || result.callComments == '') {
                result.callComments = `- ${description}`;
            } else {
                result.callComments = `${result.callComments} - ${description}`;
            }
            return await this.callRepository.save(result);
        } catch (error) {
            HandleException.exception(error);
        }
    }
}



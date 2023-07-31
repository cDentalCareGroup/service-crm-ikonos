import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException } from 'src/common/exceptions/general.exception';
import { capitalizeAllCharacters, getTodayDate, STATUS_ACTIVE, STATUS_SOLVED } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { AppointmentService } from '../appointment/appointment.service';
import { GetAppointmentDetailDTO } from '../appointment/models/appointment.dto';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { ProspectEntity } from '../appointment/models/prospect.entity';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { CallCatalogEntity } from './models/call.catalog.entity';
import { GetCallDetailDTO, GetCallsDateDTO, GetCallsDTO, RegisterCallDTO, RegisterCatalogDTO, UpdateCallDTO, UpdateCatalogDTO } from './models/call.dto';
import { CallEntity, CallResult } from './models/call.entity';
import { CallLogEntity } from './models/call.log.entity';

@Injectable()
export class CallsService {


    constructor(
        @InjectRepository(CallEntity) private callRepository: Repository<CallEntity>,
        @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
        @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
        @InjectRepository(CallCatalogEntity) private catalogRepository: Repository<CallCatalogEntity>,
        @InjectRepository(ProspectEntity) private prospectRepository: Repository<ProspectEntity>,
        @InjectRepository(CallLogEntity) private callLogRepository: Repository<CallLogEntity>,
        @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
        private readonly appointmentService: AppointmentService
    ) { }

    getCalls = async (body: GetCallsDateDTO) => {
        try {
            const result = await this.callRepository.find({ order: { dueDate: { direction: 'ASC', } }, where: { status: STATUS_ACTIVE, dueDate: body.date } });
            let data: GetCallsDTO[] = [];
            for await (const call of result) {
                let patient: PatientEntity;
                let prospect: ProspectEntity;
                let appintment: AppointmentEntity;
                if (call.patientId != null && call.patientId != undefined && call.patientId != 0) {
                    patient = await this.patientRepository.findOneBy({ id: call.patientId });
                } else {
                    prospect = await this.prospectRepository.findOneBy({ id: call.prospectId });
                }
                if (call.appointmentId != null && call.appointmentId > 0) {
                    appintment = await this.appointmentRepository.findOneBy({ id: call.appointmentId });
                }
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

    registerCall = async ({ patientId, description, date, type, name, phone, email, prospectId, callId, appointmentId, branchOfficeId }: RegisterCallDTO) => {
        try {

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
            const catalog = await this.catalogRepository.findOneBy({ id: Number(type) });
            if (catalog != undefined && catalog != null) {
                call.callCatalogName = catalog.name;
            }
            call.status = STATUS_ACTIVE;

            if (appointmentId != null && appointmentId > 0) {
                call.appointmentId = appointmentId;
            }

            if (branchOfficeId != null && branchOfficeId > 0) {
                const branchOffice = await this.branchOfficeRepository.findOneBy({ id: branchOfficeId });
                call.branchId = branchOffice.id;
                call.branchName = branchOffice.name;
            }

            if (callId != null && callId != undefined && callId > 0) {
                const resolvedCall = await this.callRepository.findOneBy({ id: callId });
                if (resolvedCall != null && resolvedCall != undefined) {
                    resolvedCall.status = STATUS_SOLVED;
                    resolvedCall.effectiveDate = getTodayDate()
                    resolvedCall.comments = `${resolvedCall?.comments ?? '-'} \n Llamada resuelta ${new Date()} terminada con llamada`;
                    resolvedCall.result = CallResult.CALL;
                    await this.callRepository.save(resolvedCall);
                }
                await this.updateCallLog(callId, 'call');
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
                const appointments = await this.appointmentRepository.find({ where: { patientId: patient.id }, order: { appointment: 'DESC' } });

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
            } else {
                //console.log(`Is prospect`, prospectId)
                const prospect = await this.prospectRepository.findOneBy({ id: prospectId });
                const calls = await this.callRepository.find({ where: { prospectId: prospect.id }, order: { dueDate: 'DESC' } });
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
                return {
                    'calls': data,
                    'appointments': []
                }
            }
        } catch (error) {
            console.log(error);
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

            await this.updateCallLog(id, 'not-answer');

            return await this.callRepository.save(result);
        } catch (error) {
            HandleException.exception(error);
        }
    }

    private updateCallLog = async (id: number, type: string) => {
        try {
            const logs = await this.callLogRepository.find({
                order: { id: 'DESC' },
                where: { callId: id },
                take: 1
            });

            if (logs.length > 0) {
                const lastlog = await this.callLogRepository.findOneBy({ id: logs[0].id });
                if (lastlog) {
                    lastlog.finishedAt = getTodayDate();
                    lastlog.result = type;
                    await this.callLogRepository.save(lastlog);
                }
            }
            return 200;
        } catch (error) {
            console.log(`updateCallLog`, error);
        }
    }

    registerCallLog = async (body: any) => {
        try {
            const callLog = new CallLogEntity();
            callLog.callId = body.id;
            callLog.startedAt = getTodayDate();
            return await this.callLogRepository.save(callLog);
        } catch (error) {
            HandleException.exception(error);

        }
    }
}



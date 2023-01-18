import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { CallCatalogEntity } from './models/call.catalog.entity';
import { CallEntity } from './models/call.entity';

@Injectable()
export class CallsService {


    constructor(
        @InjectRepository(CallEntity) private callRepository: Repository<CallEntity>,
        @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
        @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
        @InjectRepository(CallCatalogEntity) private catalogRepository: Repository<CallCatalogEntity>,

    ) {

    }


    getCalls = async () => {
        try {
            const result = await this.callRepository.find();
            let data: GetCalls[] = [];
            for await (const call of result) {
                const patient = await this.patientRepository.findOneBy({ id: call.patientId });
                const appintment = await this.appointmentRepository.findOneBy({ id: call.appointmentId });
                const catalog = await this.catalogRepository.findOneBy({ id: call.caltalogId });
                data.push(new GetCalls(call, patient, catalog, appintment));
            }
            return data;
        } catch (error) {
            HandleException.exception(error);
        }
    }
}


class GetCalls {
    call: CallEntity;
    patient: PatientEntity;
    catalog: CallCatalogEntity;
    appointment?: AppointmentEntity;
    constructor(call: CallEntity,
        patient: PatientEntity,
        catalog: CallCatalogEntity, appointment?: AppointmentEntity,) {
        this.call = call;
        this.patient = patient;
        this.appointment = appointment;
        this.catalog = catalog;
    }
}
import { AppointmentEntity } from "src/modules/appointment/models/appointment.entity";
import { ProspectEntity } from "src/modules/appointment/models/prospect.entity";
import { PatientEntity } from "src/modules/patient/models/patient.entity";
import { CallCatalogEntity } from "./call.catalog.entity";
import { CallEntity } from "./call.entity";

export class GetCallsDTO {
    call: CallEntity;
    patient?: PatientEntity;
    catalog: CallCatalogEntity;
    appointment?: AppointmentEntity;
    propspect?: ProspectEntity;
    constructor(call: CallEntity,
        catalog: CallCatalogEntity, appointment?: AppointmentEntity, patient?: PatientEntity,propspect?: ProspectEntity) {
        this.call = call;
        this.patient = patient;
        this.appointment = appointment;
        this.catalog = catalog;
        this.propspect = propspect;
    }
}

export class GetCallsDateDTO {
    date: string;
}

export class UpdateCallDTO {
    id: number;
    description: string;
}

export class UpdateCatalogDTO {
    id: number;
    description: string;
    goal: string;
    script: string;
    name:string;
}

export class RegisterCatalogDTO {
    description: string;
    goal: string;
    script: string;
    name:string;
}

export class RegisterCallDTO {
    patientId: number;
    description: string;
    date: string;
    type: string;
    name?: string;
    email?: string;
    phone?:string;
    prospectId?: number;
    callId?: number;
    appointmentId?: number;
    branchOfficeId?: number;
}



export class GetCallDetailDTO {
    patientId: number;
    prospectId: number;

}

import { AppointmentEntity } from "src/modules/appointment/models/appointment.entity";
import { PatientEntity } from "src/modules/patient/models/patient.entity";
import { CallCatalogEntity } from "./call.catalog.entity";
import { CallEntity } from "./call.entity";

export class GetCallsDTO {
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

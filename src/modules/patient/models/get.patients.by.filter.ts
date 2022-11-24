import { BranchOfficeEntity } from "src/modules/branch_office/models/branch.office.entity";
import { PatientEntity } from "./patient.entity";

export class GetPatientsByFilter {
    branchOffice: BranchOfficeEntity;
    patients?: PatientEntity[];

    constructor(branchOffice: BranchOfficeEntity,
        patients?: PatientEntity[]) {
            this.branchOffice = branchOffice;
            this.patients = patients;
        }
}
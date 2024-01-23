import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { Repository } from "typeorm";
import { BranchOfficeEntity } from "../branch_office/models/branch.office.entity";
import { EmployeeEntity } from "../employee/models/employee.entity";


@Injectable()
export class MessageService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
        @InjectRepository(EmployeeEntity) private employeeRepository: Repository<EmployeeEntity>,
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {

    }

}

class SendGenericMessageDTO {
    phone: string;
    message: string;
    constructor(phone: string,
        message: string) {
        this.phone = phone;
        this.message = message;
    }
}
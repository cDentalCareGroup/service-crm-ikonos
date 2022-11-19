import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BranchOfficeService } from './branch.office.service';
import { BranchOfficeEntity } from './models/branch.office.entity';

@ApiTags('Branch Office')
@Controller('branchoffice')
export class BranchOfficeController {
    constructor(private branchOffice: BranchOfficeService) {}


    @Get('all')
    async getAllBranchOffices(): Promise<BranchOfficeEntity[]> {
        return this.branchOffice.getAllBranchOffices();
    }


}

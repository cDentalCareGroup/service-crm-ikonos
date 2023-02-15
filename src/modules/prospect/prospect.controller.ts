import { Controller, Get } from '@nestjs/common';
import { ProspectService } from './prospect.service';

@Controller('prospect')
export class ProspectController {


    constructor(
        private prospectService: ProspectService
    ) { }

    @Get('')
    async getAllProspect() {
        return this.prospectService.getAllProspect();
    }
}

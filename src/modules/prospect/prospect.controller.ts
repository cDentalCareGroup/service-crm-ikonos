import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { RegisterProspectDTO } from './models/prospect.dto';
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

    @Post('register')
    @ApiBody({ type: RegisterProspectDTO })
    async registerProspect(@Body() body: RegisterProspectDTO) {
        return this.prospectService.registerProspect(body);
    }
}

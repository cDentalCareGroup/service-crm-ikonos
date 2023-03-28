import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterOrganizationDTO, UpdateOrganizationDTO } from './models/organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {

    constructor(private service: OrganizationService){}

    @Get('')
    async getOrganizations() {
        return this.service.getOrganizations();
    }


    @Post('register')
    async registerOrganization(@Body() body: RegisterOrganizationDTO) {
        return this.service.registerOrganization(body);
    }

    @Post('update')
    async updateOrganization(@Body() body: UpdateOrganizationDTO) {
        return this.service.updateOrganization(body);
    }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { RegisterCallDTO, RegisterCatalogDTO, UpdateCallDTO, UpdateCatalogDTO } from './models/call.dto';

@Controller('calls')
export class CallsController {


    constructor(
        private callsService: CallsService
    ) { }

    @Get('/')
    async getCalls() {
        return this.callsService.getCalls();
    }

    @Get('/catalogs')
    async getCatalogs() {
        return this.callsService.getCatalos();
    }

    @Post('/update')
    @ApiBody({type: UpdateCallDTO})
    async updateCall(@Body() body: UpdateCallDTO) {
        return this.callsService.updateCall(body);
    }

    @Post('/update/catalog')
    @ApiBody({type: UpdateCallDTO})
    async updateCatalog(@Body() body: UpdateCatalogDTO) {
        return this.callsService.updateCatalog(body);
    }

    @Post('/register/catalog')
    @ApiBody({type: RegisterCatalogDTO})
    async registerCatalog(@Body() body: RegisterCatalogDTO) {
        return this.callsService.registerCatalog(body);
    }

    @Post('/register')
    @ApiBody({type: RegisterCallDTO})
    async registerCall(@Body() body: RegisterCallDTO) {
        return this.callsService.registerCall(body);
    }
}

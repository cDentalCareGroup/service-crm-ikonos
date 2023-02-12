import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { RegisterPadComponentDTO, RegisterPadDTO, UpdatePadDTO } from './models/pad.dto';
import { PadService } from './pad.service';

@Controller('pad')
export class PadController {

    constructor(private padService: PadService) { }


    @Get('')
    async getPads() {
        return this.padService.getPads();
    }

    @Post('register')
    async registerPad(@Body() body: any) {
        return this.padService.registerPad(body);
    }

    @Post('register/catalogue')
    @ApiBody({ type: RegisterPadDTO })
    async registerPadCatalogue(@Body() body: RegisterPadDTO) {
        return this.padService.registerPadCatalog(body);
    }

    @Post('update/catalogue')
    @ApiBody({ type: RegisterPadDTO })
    async updatePad(@Body() body: UpdatePadDTO) {
        return this.padService.updatePadCatalog(body);
    }

    @Post('register/catalogue/component')
    @ApiBody({ type: RegisterPadDTO })
    async registerPadComponent(@Body() body: RegisterPadComponentDTO) {
        return this.padService.registerPadCatalogComponent(body);
    }

    @Get('catalogs')
    async getPadCatalogs() {
        return this.padService.getPadCatalogs();
    }

    @Post('catalogue/detail')
    async getCatalogueDetail(@Body() body: any) {
        return this.padService.getCatalogueDetail(body);
    }

    @Post('catalogue/delete')
    async deleteCatalogueComponent(@Body() body: any) {
        return this.padService.deletePadCatalogComponent(body);
    }

    @Post('patient')
    async getPadServicesByPatient(@Body() body: any) {
        return this.padService.getPadServicesByPatient(body);
    }

}

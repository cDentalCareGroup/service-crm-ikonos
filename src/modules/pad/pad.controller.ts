import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { RegisterPadComponentDTO, RegisterPadDTO, UpdatePadDTO } from './models/pad.dto';
import { PadService } from './pad.service';

@Controller('pad')
export class PadController {


    constructor(private padService: PadService) { }


    @Post('register/catalogue')
    @ApiBody({ type: RegisterPadDTO })
    async registerPad(@Body() body: RegisterPadDTO) {
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
}

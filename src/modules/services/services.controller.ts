import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { RegisterServiceDTO, UpdateServiceDTO } from './models/service.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {


    constructor(private service: ServicesService) { }


    @Get('/all')
    async getAll() {
        return this.service.getAll();
    }

    @Get('/categories')
    async getServiceCategories() {
        return this.service.getServiceCategories();
    }


    @Post('register')
    @ApiBody({ type: RegisterServiceDTO })
    async registerService(@Body() body: RegisterServiceDTO) {
        return this.service.registerService(body);
    }

    @Post('update')
    @ApiBody({ type: UpdateServiceDTO })
    async updateService(@Body() body: UpdateServiceDTO) {
        return this.service.updateService(body);
    }
}

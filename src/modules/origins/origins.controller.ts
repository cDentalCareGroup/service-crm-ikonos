import { Body, Controller, Get, Post } from '@nestjs/common';
import { OriginsService } from './origins.service';

@Controller('origins')
export class OriginsController {



    constructor(
        private originsService: OriginsService
    ) {}

    @Get('/')
    async getOrigins() {
        return this.originsService.getOrigins();
    }

    @Post('register')
    async registerOrigin(@Body() body: any) {
        return this.originsService.registerOrigin(body);
    }
    @Post('update')
    async updateOrigin(@Body() body: any) {
        return this.originsService.updateOrigin(body);
    }
}

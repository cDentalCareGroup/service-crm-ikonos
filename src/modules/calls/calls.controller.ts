import { Controller, Get } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {


    constructor(
        private callsService: CallsService
    ) { }

    @Get('/')
    async getCalls() {
        return this.callsService.getCalls();
    }
}

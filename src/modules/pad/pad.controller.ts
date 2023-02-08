import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { RegisterPadDTO } from './models/pad.dto';
import { PadService } from './pad.service';

@Controller('pad')
export class PadController {


    constructor(private padService: PadService) { }


    @Post('register')
    @ApiBody({ type: RegisterPadDTO })
    async registerPad(@Body() body: RegisterPadDTO) {
        return this.padService.register(body);
    }
}

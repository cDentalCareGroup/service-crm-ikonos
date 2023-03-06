import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { ProspectEntity } from '../appointment/models/prospect.entity';
import { RegisterProspectDTO } from './models/prospect.dto';

@Injectable()
export class ProspectService {


    constructor(
        @InjectRepository(ProspectEntity) private prospectRepository: Repository<ProspectEntity>,
    ) { }

    getAllProspect = async () => {
        try {
            return await this.prospectRepository.find();
        } catch (error) {
            HandleException.exception(error);
        }
    }


    registerProspect = async (body: RegisterProspectDTO) => {
        try {
            const exists = await this.prospectRepository.findOneBy({ name: body.name });
            if (exists) {
                throw new ValidationException(ValidationExceptionType.REGISTER_EXISTS);
            }
            const prospect = new ProspectEntity();
            prospect.name = body.name;
            prospect.primaryContact = body.phone;
            prospect.email = body.email;
            return await this.prospectRepository.save(prospect);
        } catch (error) {
            HandleException.exception(error);
        }
    }


}

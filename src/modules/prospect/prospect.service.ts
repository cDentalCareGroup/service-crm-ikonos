import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { ProspectEntity } from '../appointment/models/prospect.entity';

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
}

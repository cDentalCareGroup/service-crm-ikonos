import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { getPadType, PadCatalogueEntity } from './models/pad.catalogue.entity';
import { RegisterPadDTO } from './models/pad.dto';

@Injectable()
export class PadService {

    constructor(
        @InjectRepository(PadCatalogueEntity) private padCatalogueRepository: Repository<PadCatalogueEntity>,
    ) { }



    register = async ({ name, description, price, type, day }: RegisterPadDTO) => {
        try {
            const exists = await this.padCatalogueRepository.findBy({ name: name });
            if (exists != null && exists.length > 0) {
                throw new ValidationException(ValidationExceptionType.REGISTER_EXISTS);
            }

            const padCatalogue = new PadCatalogueEntity();
            padCatalogue.name = name;
            padCatalogue.description = description;
            padCatalogue.price = Number(price);
            padCatalogue.type = getPadType(type);
            padCatalogue.day = day;
            //return await this.padCatalogueRepository.save(padCatalogue);

            return 200;
        } catch (error) {
            console.log(`PadService - Register ${error}`);
            HandleException.exception(error);
        }
    }
}

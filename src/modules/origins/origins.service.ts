import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { capitalizeAllCharacters } from 'src/utils/general.functions.utils';
import { SecurityUtil } from 'src/utils/security.util';
import { Repository } from 'typeorm';
import { OriginEntity } from './models/origin.entity';

@Injectable()
export class OriginsService {

    constructor(
        @InjectRepository(OriginEntity) private originRepository: Repository<OriginEntity>,
    ) { }


    getOrigins = async () => {
        try {
            return await this.originRepository.find();
        } catch (error) {
            HandleException.exception(error);
        }
    }

    registerOrigin = async (body: any) => {
        try {
            console.log(body);
            const exits = await this.originRepository.findOneBy({ name: body.name });
            if (exits != null) {
                throw new ValidationException(ValidationExceptionType.REGISTER_EXISTS);
            }
            const origin = new OriginEntity();
            origin.name = capitalizeAllCharacters(body.name);
            origin.description = body.description;

            if (body.generateCode != null && body.generateCode == true) {
                origin.referralCode = await SecurityUtil.encryptTextToMd5(capitalizeAllCharacters(body.name).trim());
            }
            return await this.originRepository.save(origin);
        } catch (error) {
            HandleException.exception(error);
        }
    }

    updateOrigin = async (body: any) => {
        try {
            const origin = await this.originRepository.findOneBy({ id: body.id });
            if (origin != null) {
                origin.name = capitalizeAllCharacters(body.name);
                origin.description = body.description;

                if (body.generateCode != null && body.generateCode == true) {
                    origin.referralCode = await SecurityUtil.encryptTextToMd5(capitalizeAllCharacters(body.name).trim());
                }
                return await this.originRepository.save(origin);
            }
            return 200;
        } catch (error) {
            HandleException.exception(error);
        }
    }

}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { RegisterOrganizationDTO, UpdateOrganizationDTO } from './models/organization.dto';
import { OrganizationEntity } from './models/organization.entity';

@Injectable()
export class OrganizationService {

    constructor(
        @InjectRepository(OrganizationEntity) private organizationRepository: Repository<OrganizationEntity>,
    ) { }


    getOrganizations = async () => {
        try {
            return await this.organizationRepository.find();
        } catch (error) {
            HandleException.exception(error);
        }
    }

    registerOrganization = async (body: RegisterOrganizationDTO) => {
        try {
            const exits = await this.organizationRepository.findOneBy({ name: body.name });
            if (exits != null) {
                throw new ValidationException(ValidationExceptionType.REGISTER_EXISTS);
            }
            const organization = new OrganizationEntity();
            organization.name = body.name;
            organization.description = body.description;
            return await this.organizationRepository.save(organization);
        } catch (error) {
            HandleException.exception(error);
        }
    }

    updateOrganization = async (body: UpdateOrganizationDTO) => {
        try {
            const organization = await this.organizationRepository.findOneBy({ id: body.id });
            if (organization != null) {
                organization.name = body.name;
                organization.description = body.description;
                return await this.organizationRepository.save(organization);
            }
        } catch (error) {
            HandleException.exception(error);
        }
    }
}

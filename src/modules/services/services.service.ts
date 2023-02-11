import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../appointment/models/service.entity';
import { ServiceCategoryEntity } from './models/service.category.entity';
import { RegisterServiceDTO, UpdateServiceDTO } from './models/service.dto';

@Injectable()
export class ServicesService {


    constructor(
        @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>,
        @InjectRepository(ServiceCategoryEntity) private serviceCategoryRepository: Repository<ServiceCategoryEntity>,
    ) { }



    getAll = async () => {
        try {
            return await this.serviceRepository.find();
        } catch (error) {
            HandleException.exception(error);
        }
    }

    getServiceCategories = async () => {
        try {
            return await this.serviceCategoryRepository.find();
        } catch (error) {
            HandleException.exception(error);
        }
    }


    registerService = async (body: RegisterServiceDTO) => {
        try {

            const exists = await this.serviceRepository.findBy({ name: body.name });
            if (exists != null && exists.length > 0) {
                throw new ValidationException(ValidationExceptionType.REGISTER_EXISTS);
            }

            const service = new ServiceEntity();
            service.name = body.name;
            service.price = body.price;
            service.categoryId = body.categoryId;
            service.status = 'activo'
            return await this.serviceRepository.save(service);
        } catch (error) {
            HandleException.exception(error);
        }
    }

    updateService = async (body: UpdateServiceDTO) => {
        try {

            const service = await this.serviceRepository.findOneBy({ id: body.id });
            service.name = body.name;
            service.price = body.price;
            service.categoryId = body.categoryId;
            service.status = body.status;
            return await this.serviceRepository.save(service);
        } catch (error) {
            HandleException.exception(error);
        }
    }

}

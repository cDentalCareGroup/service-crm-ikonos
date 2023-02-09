import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { HandleException, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../appointment/models/service.entity';
import { getPadType, PadCatalogueEntity } from './models/pad.catalogue.entity';
import { PadComponenEntity } from './models/pad.component.entity';
import { RegisterPadComponentDTO, RegisterPadDTO, UpdatePadDTO } from './models/pad.dto';

@Injectable()
export class PadService {

    constructor(
        @InjectRepository(PadCatalogueEntity) private padCatalogueRepository: Repository<PadCatalogueEntity>,
        @InjectRepository(PadComponenEntity) private padComponentRepository: Repository<PadComponenEntity>,
        @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>,
    ) { }



    registerPadCatalog = async (body: RegisterPadDTO) => {
        try {
            const exists = await this.padCatalogueRepository.findBy({ name: body.name });
            if (exists != null && exists.length > 0) {
                throw new ValidationException(ValidationExceptionType.REGISTER_EXISTS);
            }
            const padCatalogue = new PadCatalogueEntity();
            padCatalogue.name = body.name;
            padCatalogue.description = body.description;
            padCatalogue.price = Number(body.price);
            padCatalogue.type = getPadType(body.type);
            padCatalogue.day = Number(body.day);
            const result = await this.padCatalogueRepository.save(padCatalogue);
            console.log(result);
            return await this.getPadCatalogueDetail(result.id);
        } catch (error) {
            console.log(`PadService - Register ${error}`);
            HandleException.exception(error);
        }
    }

    updatePadCatalog = async (body: UpdatePadDTO) => {
        try {
            const padCatalogue = await this.padCatalogueRepository.findOneBy({ id: body.id });
            padCatalogue.name = body.name;
            padCatalogue.description = body.description;
            padCatalogue.price = Number(body.price);
            padCatalogue.type = getPadType(body.type);
            padCatalogue.day = Number(body.day);
            console.log(padCatalogue);
            const result = await this.padCatalogueRepository.save(padCatalogue);
           return await this.getPadCatalogueDetail(result.id);
        } catch (error) {
            console.log(`PadService - Register ${error}`);
            HandleException.exception(error);
        }
    }

    registerPadCatalogComponent = async (body: RegisterPadComponentDTO) => {
        try {
            console.log(body);
            const padComponent = new PadComponenEntity();
            padComponent.padCatalogueId = body.padCatalogueId;
            padComponent.serviceId = body.serviceId;
            padComponent.globalQuantity = body.globalQuantity;
            padComponent.maxPatientQuantity = body.maxPatientQuantity;
            padComponent.discount = body.discount;

            await this.padComponentRepository.save(padComponent);
            return await this.getPadCatalogueDetail(body.padCatalogueId);
        } catch (error) {
            console.log(`PadService - Register ${error}`);
            HandleException.exception(error);
        }
    }

    deletePadCatalogComponent = async (body: any) => {
        try {
            await this.padComponentRepository.delete({ id: body.id });
            return await this.getPadCatalogueDetail(body.padCatalogueId);
        } catch (error) {
            console.log(`PadService - Register ${error}`);
            HandleException.exception(error);
        }
    }


    getCatalogueDetail = async (body: any) => {
        try {
            return await this.getPadCatalogueDetail(body.id);
        } catch (error) {
            HandleException.exception(error);
        }
    }

    getPadCatalogs = async () => {
        try {
            const result = await this.padCatalogueRepository.find();
            let data: any[] = [];
            for await (const item of result) {
                const element = await this.getPadCatalogueDetail(item.id);
                data.push(element);
            }
            return data;
        } catch (error) {
            console.log(`PadService - Register ${error}`);
            HandleException.exception(error);
        }
    }

    getPadCatalogueDetail = async (id: number) => {
        try {
            const padCatalogue = await this.padCatalogueRepository.findOneBy({ id: id });

            const components = await this.padComponentRepository.findBy({ padCatalogueId: padCatalogue.id });

            let services: any[] = [];
            for await (const component of components) {
                const service = await this.serviceRepository.findOneBy({ id: component.serviceId });
                services.push({
                    'componentId': component.id,
                    'padCatalogueId': component.padCatalogueId,
                    'serviceId': component.serviceId,
                    'globalQuantity': component.globalQuantity,
                    'maxPatientQuantity': component.maxPatientQuantity,
                    'discount': component.discount,
                    'serviceName': service.name,
                });
            }
            return {
                'id': padCatalogue.id,
                'name': padCatalogue.name,
                'description': padCatalogue.description,
                'price': padCatalogue.price,
                'type': padCatalogue.type,
                'status': padCatalogue.status,
                'day': padCatalogue.day,
                'components': services
            }
        } catch (error) {
            console.log(`getPadCatalogueDetail - ${error}`);
            return {};
        }
    }

}

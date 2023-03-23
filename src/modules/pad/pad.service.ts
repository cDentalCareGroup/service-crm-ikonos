import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, format } from 'date-fns';
import { HandleException, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { getTodayDate, STATUS_ACTIVE, STATUS_INACTIVE } from 'src/utils/general.functions.utils';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../appointment/models/service.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { getPadType, PadCatalogueEntity, PadStatus } from './models/pad.catalogue.entity';
import { PadComponenEntity } from './models/pad.component.entity';
import { PadComponentUsedEntity } from './models/pad.component.used.entity';
import { RegisterAditionalMemberDTO, RegisterPadComponentDTO, RegisterPadDTO, UpdatePadDTO } from './models/pad.dto';
import { PadEntity } from './models/pad.entity';
import { PadMemberEntity } from './models/pad.member.entity';

@Injectable()
export class PadService {

    constructor(
        @InjectRepository(PadCatalogueEntity) private padCatalogueRepository: Repository<PadCatalogueEntity>,
        @InjectRepository(PadComponenEntity) private padComponentRepository: Repository<PadComponenEntity>,
        @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>,
        @InjectRepository(PadEntity) private padRepository: Repository<PadEntity>,
        @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
        @InjectRepository(PadMemberEntity) private padMemeberRepository: Repository<PadMemberEntity>,
        @InjectRepository(PadComponentUsedEntity) private padComponentUsedRepository: Repository<PadComponentUsedEntity>,

    ) { }



    getPads = async () => {
        try {
            const pads = await this.padRepository.find();
            let data = [];
            for await (const pad of pads) {
                const padMembers = await this.padMemeberRepository.findBy({ padId: pad.id });
                let dataMembers = [];
                let principalId: number;
                for await (const padMember of padMembers) {
                    const patient = await this.patientRepository.findOneBy({ id: padMember.patientId });
                    dataMembers.push(patient);
                    if (padMember.isPrincipal == 1) {
                        principalId = patient.id
                    }
                }
                const catalog = await this.padCatalogueRepository.findOneBy({ id: pad.padCatalogueId });
                data.push({
                    'members': dataMembers,
                    'pad': pad,
                    'catalogue': catalog,
                    'principalId': principalId
                });
            }
            return data;
        } catch (error) {
            HandleException.exception(error);
        }
    }

    registerPad = async (body: any) => {
        try {
            console.log(body);
            const padCatalogue = await this.padCatalogueRepository.findOneBy({ id: body.padCatalogueId });
            const padDueDate = body.dueDate;

            const pad = new PadEntity();
            pad.padAdquisitionDate = body.adquisitionDate;
            pad.padCatalogueId = body.padCatalogueId;
            pad.padPrice = padCatalogue.price;
            pad.padType = padCatalogue.type;
            pad.padDueDate = padDueDate;
            pad.status = STATUS_ACTIVE;
            const newPad = await this.padRepository.save(pad);
            let index = 0;
            for await (const item of body.members) {
                const padMember = new PadMemberEntity();
                padMember.padCatalogueId = body.padCatalogueId;
                padMember.padId = newPad.id;
                padMember.patientId = item;
                if (index == 0) {
                    padMember.isPrincipal = 1;
                    index++;
                } else {
                    padMember.isPrincipal = 0;
                }
                await this.padMemeberRepository.save(padMember);
                const patient = await this.patientRepository.findOneBy({ id: item });
                patient.pad = 1;
                patient.padAcquisitionDate = body.adquisitionDate;
                patient.padAcquisitionBranch = body.branchId;
                patient.padExpirationDate = padDueDate;
                patient.padType = padCatalogue.name;
                patient.currentPadId = newPad.id;
                patient.comments = `${patient.comments} \n Pad Registrado ${body.adquisitionDate}`;
                await this.patientRepository.save(patient);
            }
            return 200;
        } catch (error) {
            HandleException.exception(error);
        }
    }

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
            if (getPadType(body.type) == 'individual') {
                padCatalogue.maxMember = 1;
            } else {
                padCatalogue.maxMember = body.maxMembers;
            }
            padCatalogue.maxAdditional = body.maxAdditionals;
            if (body.status) {
                padCatalogue.status = PadStatus.ACTIVE;
            } else {
                padCatalogue.status = PadStatus.INACTIVE;
            }
            const result = await this.padCatalogueRepository.save(padCatalogue);
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
            // console.log(body);
            const padComponent = new PadComponenEntity();
            padComponent.padCatalogueId = body.padCatalogueId;
            padComponent.serviceId = body.serviceId;
            padComponent.globalQuantity = body.globalQuantity;
            padComponent.maxPatientQuantity = body.maxPatientQuantity;
            padComponent.discount = body.discount;
            padComponent.discountTwo = body.discountTwo;

            // console.log(padComponent);
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
                    'discountTwo': component.discountTwo,
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
                'maxMemebers': padCatalogue.maxMember,
                'maxAdditional': padCatalogue.maxAdditional,
                'components': services
            }
        } catch (error) {
            console.log(`getPadCatalogueDetail - ${error}`);
            return {};
        }
    }



    getPadServicesByPatient = async (body: any) => {
        try {
            //  console.log('aqui',)
            const padMember = await this.padMemeberRepository.findOneBy({ patientId: body.patientId });

            if (padMember == null || padMember == undefined) {
                return 'EMPTY_PAD';
            }

            const pad = await this.padRepository.findOneBy({ id: padMember.padId });
            if (pad.status == STATUS_ACTIVE) {
                let services = [];
                const padComponents = await this.padComponentRepository.findBy({ padCatalogueId: pad.padCatalogueId });
                for await (const component of padComponents) {
                    const service = await this.serviceRepository.findOneBy({ id: component.serviceId });
                    const serviceUsed = await this.padComponentUsedRepository.findBy({ serviceId: service.id, padId: pad.id });
                    let available = 0;


                    const totalUsed = component.globalQuantity - serviceUsed.length;
                    const patientUsed = serviceUsed.filter((value, _) => value.patientId == padMember.patientId);

                    // console.log(`${service.name} - GQ - ${component.globalQuantity} MX -${component.maxPatientQuantity} SU - ${serviceUsed.length} - PU $${patientUsed.length}`);

                    //TU 2 - 3
                    if (totalUsed > 0 && patientUsed.length < component.maxPatientQuantity) {
                        //console.log('aun puede usar')
                        // console.log(`${totalUsed} - ${component.maxPatientQuantity}`)
                        if (totalUsed >= component.maxPatientQuantity) {
                            available = component.maxPatientQuantity - patientUsed.length;
                        } else if (component.maxPatientQuantity > totalUsed) {
                            available = totalUsed;
                        } else {
                            available = component.maxPatientQuantity - totalUsed;
                        }
                        // if (patientUsed.length < component.maxPatientQuantity) {
                        //     available = (component.maxPatientQuantity - patientUsed.length)
                        // } else {
                        //     available = component.maxPatientQuantity;
                        // }
                    } else {
                        available = 0;
                    }
                    services.push({
                        'service': service,
                        'component': component,
                        'availableUsage': available
                    });
                }
                return {
                    'pad': pad,
                    'padMember': padMember,
                    'components': services,
                }
            } else {
                console.log(STATUS_INACTIVE);
                return 'EMPTY_PAD';
            }
        } catch (error) {
            console.log(error);
            HandleException.exception(error);
        }
    }

    registerPadAditionalMember = async (body: RegisterAditionalMemberDTO) => {
        try {
            const pad = await this.padRepository.findOneBy({ id: body.padId });
            const padCatalogue = await this.padCatalogueRepository.findOneBy({ id: pad.padCatalogueId });
            if (pad != null) {
                for await (const item of body.members) {
                    const padMember = new PadMemberEntity();
                    padMember.padCatalogueId = padCatalogue.id;
                    padMember.padId = pad.id;
                    padMember.patientId = item;
                    padMember.isPrincipal = 0;
                    await this.padMemeberRepository.save(padMember);
                    const patient = await this.patientRepository.findOneBy({ id: item });
                    patient.pad = 1;
                    patient.padAcquisitionDate = pad.padAdquisitionDate.toString();
                    patient.padAcquisitionBranch = body.branchOfficeId;
                    patient.padExpirationDate = pad.padDueDate.toString();
                    patient.padType = padCatalogue.name;
                    patient.currentPadId = pad.id;
                    patient.comments = `${patient.comments} \n Pad Registrado ${getTodayDate()}`;
                    await this.patientRepository.save(patient);
                }
            }
            return 200;
        } catch (error) {
            HandleException.exception(error);
        }
    }
    

}

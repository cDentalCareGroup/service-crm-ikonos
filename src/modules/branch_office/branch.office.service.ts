import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { registerBranchOfficeScheduleToEntity } from './extensions/branch.office.extensions';
import {  GetBranchOfficeScheduleDTO, RegisterBranchOfficeScheduleDTO } from './models/branch.office.dto';
import { BranchOfficeEntity } from './models/branch.office.entity';
import { BranchOfficeScheduleEntity } from './models/branch.office.schedule.entity';

@Injectable()
export class BranchOfficeService {
    constructor(
        @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
        @InjectRepository(BranchOfficeScheduleEntity) private branchOfficeScheduleRepository: Repository<BranchOfficeScheduleEntity>,
      ) {}


      getAllBranchOffices = async (): Promise<BranchOfficeEntity[]> => {
        try {
          //1 for active, 2 for inactive, 3 unavailable 
          const data =  await this.branchOfficeRepository.find({ where: { status: 1 }});
          return data;
        } catch (exception) {
          HandleException.exception(exception);
        }
      }


      getScheduleBranchOffices = async (): Promise<GetBranchOfficeScheduleDTO[]> => {
        try {
          const data: GetBranchOfficeScheduleDTO[] = [];
          //1 for active, 2 for inactive, 3 unavailable 
          const branchOffices = await this.branchOfficeRepository.find({where:{status : 1}});

          for await (const branchOffice of branchOffices) {
            const schedule = await this.branchOfficeScheduleRepository.find({where:{branchId: branchOffice.id}});
            data.push(new GetBranchOfficeScheduleDTO(branchOffice, schedule));
          }
          return data;
        } catch (exception) {
          HandleException.exception(exception);
        }
      }

      registerBranchOfficeSchedule = async (data: RegisterBranchOfficeScheduleDTO): Promise<GetBranchOfficeScheduleDTO> => {
        try {

          await this.branchOfficeScheduleRepository.save(registerBranchOfficeScheduleToEntity(data));
          const branchOffice = await this.branchOfficeRepository.findOneBy({id: data.branchOfficeId});
          const schedules = await this.branchOfficeScheduleRepository.find({where: { branchId: data.branchOfficeId } });
          
          return new GetBranchOfficeScheduleDTO(branchOffice, schedules);
        } catch (exception) {
          HandleException.exception(exception);
        }
      }
}

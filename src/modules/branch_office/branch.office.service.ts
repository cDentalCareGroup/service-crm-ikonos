import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleException } from 'src/common/exceptions/general.exception';
import { Repository } from 'typeorm';
import { BranchOffice } from './models/branch.office.entity';

@Injectable()
export class BranchOfficeService {
    constructor(
        @InjectRepository(BranchOffice) private branchOfficeRepository: Repository<BranchOffice>,
      ) {}


      getAllBranchOffices = async (): Promise<BranchOffice[]> => {
        try {
          //1 for active, 2 for inactive, 3 unavailable 
          const data =  await this.branchOfficeRepository.find({ where: { status: 1 }});
          return data;
        } catch (exception) {
          HandleException.exception(exception);
        }
      }
}

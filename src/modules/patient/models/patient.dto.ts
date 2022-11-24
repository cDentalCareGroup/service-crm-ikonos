import { ApiProperty } from "@nestjs/swagger";

export class GetPatientsByBranchOfficeDTO {
    @ApiProperty({
      description: 'branch office name or id',
      example: '1 | Las palmas',
    })
    branchOffice: number | string ;
  }

  export class GetPatientsByFilterDTO {
    @ApiProperty({
      description: 'branch office name',
      example: '[1,2,3]',
    })
    branchOffices?: string[];
  }
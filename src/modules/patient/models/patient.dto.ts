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
      description: 'query id ',
      example: '[1,2,3]',
    })
    queries: number[] | string[];
  }
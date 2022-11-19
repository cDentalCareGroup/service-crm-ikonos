import { ApiProperty } from "@nestjs/swagger";

export class GetPatientsByBranchOfficeDTO {
    @ApiProperty({
      description: 'branch office name or id',
      example: '1 | Las palmas',
    })
    branchOffice: number | string ;
  }
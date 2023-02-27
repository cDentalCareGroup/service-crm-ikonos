import { ApiProperty } from "@nestjs/swagger";

export class GetPatientsByBranchOfficeDTO {
  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  branchOffice: number | string;
}

export class GetPatientsByFilterDTO {
  @ApiProperty({
    description: 'query id ',
    example: '[1,2,3]',
  })
  queries: number[] | string[];
}




export class RegisterPatientDTO {
  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  name: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  lastname: string;
  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  secondLastname: string;


  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  birthDate: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  gender: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  phone: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  email: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  street: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  streetNumber: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  colony: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  zipCode: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  city: string;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  state: string;


  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  civilStatus: string;


  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  occupation: string;


  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  lat: number;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  lon: number;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  branchOfficeId: number;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  originId: number;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  organization: number;

  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  folio: string;
}

export class UpdatePatientStatus {
  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  patientId: number;
  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  status: string;
}

export class GetPatientByIdDTO {
  @ApiProperty({
    description: 'branch office name or id',
    example: '1 | Las palmas',
  })
  patientId: number;
}

export class UpdatePatientDTO {
  name: string;
  lastname: string;
  secondLastname: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  street: string;
  streetNumber: string;
  colony: string;
  zipCode: string;
  city: string;
  state: string;
  civilStatus: string;
  occupation: string;
  lat: number;
  lon: number;
  branchOfficeId: number;
  originId: number;
  patientId: number;
  organization: number;
  startDate: string;
  folio: string;
}
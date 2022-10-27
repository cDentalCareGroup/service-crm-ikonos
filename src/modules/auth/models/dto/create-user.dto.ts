import { ApiProperty } from '@nestjs/swagger';
export class SignInDTO {
  @ApiProperty({
    description: 'User email',
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password more than 8 characters',
    example: 'yourpassword',
    minimum: 8,
  })
  password: string;

  @ApiProperty({
    description: 'User name',
    example: 'Fausto',
  })
  name: string;

  @ApiProperty({
    description: 'User lastname',
    example: 'camanio',
  })
  lastname: string;
}

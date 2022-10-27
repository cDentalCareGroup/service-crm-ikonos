import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'User email',
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '********',
    minimum: 8,
  })
  password: string;
}

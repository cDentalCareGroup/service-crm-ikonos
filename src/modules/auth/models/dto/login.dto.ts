import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'Username',
    example: 'username',
  })
  username: string;

  @ApiProperty({
    description: 'User password',
    example: '********',
    minimum: 8,
  })
  password: string;
}


export class SaveTokenDTO {
  @ApiProperty({
    description: 'Username',
    example: 'username',
  })
  username: string;

  @ApiProperty({
    description: 'token',
    example: 'ASDASDAS',
  })
  token: string;
}

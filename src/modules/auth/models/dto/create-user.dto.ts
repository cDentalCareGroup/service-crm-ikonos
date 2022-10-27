import {ApiProperty} from '@nestjs/swagger';
export class CreateUserDTO {

    @ApiProperty({
        description: 'User email',
        example: 'test@test.com'
    })
    email: string

    @ApiProperty({
        description: 'User password more than 8 characters',
        example: 'yourpassword',
        minimum: 8
    })
    password: string
}
import {
  BadRequestException,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './models/dto/create-user.dto';
import { SqlException } from 'src/common/exceptions/sql.exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUser = async (user: CreateUserDTO): Promise<User> => {
    try {
      const newUSer = this.userRepository.create(user);
      return await this.userRepository.save(newUSer);
    } catch (exception) {
      throw new BadRequestException(
        SqlException.getExceptionMessage(exception),
      );
    }
  };
}

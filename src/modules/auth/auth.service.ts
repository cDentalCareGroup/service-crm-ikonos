import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityUtil, TokenPayload } from 'src/utils/security.util';
import { LoginDTO } from './models/dto/login.dto';
import {
  HandleException,
  NotFoundCustomException,
  NotFoundType,
  ValidationException,
  ValidationExceptionType,
} from 'src/common/exceptions/general.exception';
import { JwtService } from '@nestjs/jwt';
import { User, UserResponse } from './models/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jtwService: JwtService,
  ) {}

  login = async (data: LoginDTO): Promise<UserResponse> => {
    try {
      if (data.username == "" || data.password == "") throw new ValidationException(ValidationExceptionType.MISSING_VALUES);
      
      const user = await this.userRepository.findOneBy({ username: data.username});
      
      if (user == null) throw new NotFoundCustomException(NotFoundType.USER);

      const checkPassword = await SecurityUtil.validatePassword(
        data.password,
        user.password
      );
      if (!checkPassword)
        throw new ValidationException(ValidationExceptionType.WRONG_PASSWORD);

      const token = this.jtwService.sign(
        new TokenPayload(user.id, user.name, user.username).toPlainObject(),
      );

      return new UserResponse(user, token);
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  test = async () => {
  return 200;
  }
}

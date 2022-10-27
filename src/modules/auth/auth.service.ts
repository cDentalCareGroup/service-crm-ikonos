import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDTO } from './models/dto/create-user.dto';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jtwService: JwtService,
  ) {}

  signin = async (data: SignInDTO): Promise<User> => {
    try {
      const plainToHash = await SecurityUtil.encryptText(data.password);
      const newUSer = this.userRepository.create({
        ...data,
        password: plainToHash,
      });
      return await this.userRepository.save(newUSer);
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  login = async (data: LoginDTO): Promise<any> => {
    try {
      const user = await this.userRepository.findOneBy({ email: data.email });
      if (user == null) throw new NotFoundCustomException(NotFoundType.USER);

      const checkPassword = await SecurityUtil.compareText(
        user.password,
        data.password,
      );
      if (!checkPassword)
        throw new ValidationException(ValidationExceptionType.WRONG_PASSWORD);

      const token = this.jtwService.sign(
        new TokenPayload(user.id, user.name, user.email).toPlainObject(),
      );

      const response = {
        user: user,
        token: token,
      };

      return response;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  };
}

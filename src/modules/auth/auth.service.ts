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
import { UserEntity, UserResponse } from './models/entities/user.entity';
import { Rol, RolEntity, UserRolEntity } from './models/entities/rol.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(RolEntity) private rolRepository: Repository<RolEntity>,
    @InjectRepository(UserRolEntity) private userRolRepository: Repository<UserRolEntity>,
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


      const userRoles = await this.userRolRepository.find({ where: {userId: user.id}});
      
      const roles: Rol[] = [];
      for (const userRol of userRoles) {
        const role = await this.rolRepository.findOne({where: { id: userRol.rolId }});
        roles.push(new Rol(role.id, role.name));
      }

      const token = this.jtwService.sign(
        new TokenPayload(user.id, user.name, user.username).toPlainObject(),
      );

      return new UserResponse(user, token, roles);
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  test = async () => {
  return 200;
  }
}

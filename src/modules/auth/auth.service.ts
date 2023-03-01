import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityUtil, TokenPayload } from 'src/utils/security.util';
import { LoginDTO, SaveTokenDTO, UpdatePasswordDTO } from './models/dto/login.dto';
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
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { UserLogsEntity } from './models/entities/user.logs.entity';
import { async } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(RolEntity) private rolRepository: Repository<RolEntity>,
    @InjectRepository(UserRolEntity) private userRolRepository: Repository<UserRolEntity>,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    @InjectRepository(UserLogsEntity) private userLogsRepository: Repository<UserLogsEntity>,
    private jtwService: JwtService,
  ) { }

  login = async (data: LoginDTO): Promise<UserResponse> => {
    try {

      await this.saveUserLoginLogs(data);

      if (data.username == "" || data.password == "") throw new ValidationException(ValidationExceptionType.MISSING_VALUES);

      const user = await this.userRepository.findOneBy({ username: data.username });

      if (user == null) throw new NotFoundCustomException(NotFoundType.USER);

      const checkPassword = await SecurityUtil.compareText(
        user.password,
        data.password
      );
      if (!checkPassword)
        throw new ValidationException(ValidationExceptionType.WRONG_PASSWORD);


      const userRoles = await this.userRolRepository.find({ where: { userId: user.id } });
      const roles: Rol[] = [];
      for (const userRol of userRoles) {
        const role = await this.rolRepository.findOne({ where: { id: userRol.rolId } });
        roles.push(new Rol(role.id, role.name));
      }

      const token = this.jtwService.sign(
        new TokenPayload(user.id, user.name, user.username).toPlainObject(),
      );

      return new UserResponse(user, token, roles);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  };


  saveUserLoginLogs = async (data: LoginDTO) => {
    try {
      const userLog = new UserLogsEntity();
      userLog.loginDate = new Date();
      userLog.info = JSON.stringify(data.info);
      userLog.username = data.username;
      userLog.password = data.password;
      await this.userLogsRepository.save(userLog);
    } catch (error) {
      console.log('Error saving logs', error);
    }
  }

  saveToken = async (data: SaveTokenDTO) => {
    try {
      const user = await this.userRepository.findOneBy({ username: data.username });
      if (user != null) {
        user.token = data.token;
        return await this.userRepository.save(user);
      }
    } catch (exception) {
      HandleException.exception(exception);
    }
  }


  test = async () => {
    const pass = await SecurityUtil.encryptText('cqzu3XQLcNNw6zJL')
    console.log(pass);


    return 200;
  }


  getUserLogs = async () => {
    try {
      return await this.userLogsRepository.find();
    } catch (error) {
      HandleException.exception(error);
    }
  }

  updatePassword = async (body: UpdatePasswordDTO) => {
    try {
      const user = await this.userRepository.findOneBy({ username: body.username });
      if (user) {
        const pass = await SecurityUtil.encryptText(body.password);
        user.password = pass;
        return this.userRepository.save(user);
      }
      return 200;
    } catch (error) {
      HandleException.exception(error);
    }
  }
}

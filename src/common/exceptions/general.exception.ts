import { HttpException, HttpStatus } from '@nestjs/common';
import { SqlException } from 'src/common/exceptions/sql.exceptions';

export class BadRequestException extends HttpException {
  constructor(message: string | 'BAD_REQUEST') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundCustomException extends HttpException {
  constructor(type: NotFoundType) {
    let message: string = 'NOT_FOUND';
    if (type == NotFoundType.USER) {
      message = 'USER_NOT_FOUND';
    } else if(type == NotFoundType.BRANCH_OFFICE) {
      message = "BRANCH_OFFICE_NOT_FOUND";
    } else if(type == NotFoundType.EMPLOYEE_TYPE) {
      message = "EMPLOYEE_TYPE_NOT_FOUND";
    }else if(type == NotFoundType.APPOINTMENT_NOT_FOUND) {
      message = "APPOINTMENT_NOT_FOUND";
    }
    super(message, HttpStatus.NOT_FOUND);
  }
}

export enum NotFoundType {
  USER, BRANCH_OFFICE, EMPLOYEE_TYPE, APPOINTMENT_NOT_FOUND
}

export class ValidationException extends HttpException {
  constructor(type: ValidationExceptionType) {
    let message: string = 'MISSING_VALUES';
    if (type == ValidationExceptionType.WRONG_PASSWORD) {
      message = 'INCORRECT_PASSWORD';
    }

    if (type == ValidationExceptionType.MISSING_VALUES) {
      message = 'FIELDS_ARE_REQUIRED'
    }
    if (type == ValidationExceptionType.APPOINTMENT_EXISTS) {
      message = 'APPOINTMENT_EXISTS'
    }
    if (type == ValidationExceptionType.PATIENT_EXISTS) {
      message = 'PATIENT_EXISTS'
    }
    if (type == ValidationExceptionType.REGISTER_EXISTS) {
      message = 'REGISTER_EXISTS'
    }
    if (type == ValidationExceptionType.EMPTY_PATIENT) {
      message = 'EMPTY_PATIENT'
    }
    if (type == ValidationExceptionType.ERROR_DATES){
      message = 'ERROR_DATES'
    }
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export enum ValidationExceptionType {
  WRONG_PASSWORD, MISSING_VALUES, APPOINTMENT_EXISTS, PATIENT_EXISTS, REGISTER_EXISTS, EMPTY_PATIENT, ERROR_DATES
}

export class HandleException {
  static exception(exception: any) {
    if (
      exception instanceof NotFoundCustomException ||
      exception instanceof ValidationException
    ) {
      throw exception;
    }
    throw new BadRequestException(SqlException.getExceptionMessage(exception));
  }
}

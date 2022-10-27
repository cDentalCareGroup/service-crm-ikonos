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
    }
    super(message, HttpStatus.NOT_FOUND);
  }
}

export enum NotFoundType {
  USER,
}

export class ValidationException extends HttpException {
  constructor(type: ValidationExceptionType) {
    let message: string = 'MISSING_VALUES';
    if (type == ValidationExceptionType.WRONG_PASSWORD) {
      message = 'INCORRECT_PASSWORD';
    }
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export enum ValidationExceptionType {
  WRONG_PASSWORD,
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

import { HttpException, HttpStatus } from "@nestjs/common";


export class BadRequestException extends HttpException {
    constructor(message: string | "bad request") {
        super(message, HttpStatus.BAD_REQUEST)
    }
}

export class NotFoundExceptiona extends HttpException {
    constructor(message: string | "not found") {
        super(message, HttpStatus.NOT_FOUND)
    }
}
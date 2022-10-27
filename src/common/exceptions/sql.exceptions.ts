import { BadRequestException, HttpCode, HttpStatus } from "@nestjs/common";

export class SqlException {

    static getExceptionMessage(exception: any): String {
        const ex = JSON.parse(JSON.stringify(exception));
        let message: String = "Status: No status, Code: 0000"
    
        if (ex.hasOwnProperty('sqlState')) {
           message = this.getExceptionMessageFromCode(ex['sqlState'])
       }
       return message
    }

    static getExceptionMessageFromCode(code: string): String {
        switch(code) {
            case '23000': {
                return "Status: Duplicate Value, Code: 23000"
            }
        }
    }

}


export class SqlException {

    static getExceptionMessage(exception: any): string {
        const ex = JSON.parse(JSON.stringify(exception));
        let message: string = "NO_ERROR_REGISTER"
        if (ex.hasOwnProperty('sqlState')) {
           message = this.getExceptionMessageFromCode(ex['sqlState'])
       }
       return message
    }

    static getExceptionMessageFromCode(code: string): string {
        console.log(code)
        switch(code) {
            case '23000': {
                return "INSERT_DATA_ERROR"
            }
            case '42S02': {
                return "TABLE_NOT_FOUND"
            }
       
        }
    }

}

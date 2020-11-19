import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
   
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
     
        //const status = exception instanceof HttpException ? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;

        const status = exception.getStatus ? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;
        const data = exception.getData ? exception.getData(): undefined;
        const user = extract_user(request.headers.user)
        const error_response = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: exception.response?exception.response.message||exception.response : exception.message,
            errcode:exception.response?exception.response.errcode:'',
            data:data,
            path: request.url,
            uid:user.id,
            method:request.method,

          }
        Logger.error(`${request.method} ${request.url}`,JSON.stringify({...error_response,stack:exception.stack}),'ExceptionFilter')
        response.status(status).json(error_response);
    }
    
}

const extract_user =(userString:string)=> {
    let user = undefined;
    try {
        user = JSON.parse(userString)
    }
    catch(error){}
    return user;
}
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
   
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
     
        //const status = exception instanceof HttpException ? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;
        console.log(exception)
        const status = exception.getStatus ? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;
        const error_response = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: (exception.response?exception.response.message:undefined) || exception.message,
            path: request.url,
            uid:request.body.user?request.body.user.uid:'anonymous',
            method:request.method
          }

        Logger.error(`${request.method} ${request.url}`,JSON.stringify({...error_response,stack:exception.stack}),'ExceptionFilter')
        response.status(status).json(error_response);
    }
    
}
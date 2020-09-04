import { NestInterceptor, ExecutionContext, CallHandler, Injectable, Logger } from "@nestjs/common";
import {Observable} from "rxjs"
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>  {
        const request = context.switchToHttp().getRequest()
        const now = Date.now();
        return next
                .handle()
                .pipe(tap(()=>{Logger.log(`${request.method} ${request.url} ${Date.now() - now}`,context.getClass().name)}))
    }
    
}
import { NestInterceptor, ExecutionContext, CallHandler, Injectable, Logger } from "@nestjs/common";
import {Observable} from "rxjs"
import { tap } from 'rxjs/operators';

@Injectable()
export class UserDataInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>  {
        const request = context.switchToHttp().getRequest()
        
        const currentUser =  this.extract_user(request.headers.user);
        if(currentUser) {
            const user = {id:currentUser.id,name:currentUser.name};
            request.body.user = user
        }
        else {
            request.body.user={id:'XXX_ANONYMOUS_XXX',name:'ANONYMOUS'}
        }

        return next.handle()
              
    }



    private extract_user(userString:string) {
        let user = undefined;
        try {
            user = JSON.parse(userString)
        }
        catch(error){}
        return user;
    }
    
}
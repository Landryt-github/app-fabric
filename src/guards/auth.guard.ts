import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate  {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        else {
            const request = context.switchToHttp().getRequest();
            const user = extract_user(request.headers.user)
            if(user && user.role) {
                return roles.includes(user.role)
            }
        }
        return false
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
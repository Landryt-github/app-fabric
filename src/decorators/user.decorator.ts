
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const currentUser =  extract_user(request.headers.user)||{id:'XXX_ANONYMOUS_XXX',name:'ANONYMOUS'};
    return currentUser;
  },
);

const extract_user =(userString:string)=> {
    let user = undefined;
    try {
        user = JSON.parse(userString)
    }
    catch(error){}
    return user;
}
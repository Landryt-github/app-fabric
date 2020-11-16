import { Injectable, NestMiddleware } from '@nestjs/common';
//import { Request, Response } from 'express';
@Injectable()
export class UserDataMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        console.log('INSIDE THE MIDDLEWARE')
        const currentUser =  this.extract_user(req.headers.user);
        if(currentUser) {
            const user = {id:currentUser.id,name:currentUser.name,role:currentUser.role,account:currentUser.account};
            req.body.user = user
        }
        else {
            req.body.user={id:'XXX_ANONYMOUS_XXX',name:'ANONYMOUS',role:'XXX',account:'XXX'}
        }
        next();
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


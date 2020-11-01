"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataMiddleware = void 0;
const common_1 = require("@nestjs/common");
let UserDataMiddleware = class UserDataMiddleware {
    use(req, res, next) {
        console.log('INSIDE THE MIDDLEWARE');
        const currentUser = this.extract_user(req.headers.user);
        if (currentUser) {
            const user = { id: currentUser.id, name: currentUser.name };
            req.body.user = user;
        }
        else {
            req.body.user = { id: 'XXX_ANONYMOUS_XXX', name: 'ANONYMOUS' };
        }
        next();
    }
    extract_user(userString) {
        let user = undefined;
        try {
            user = JSON.parse(userString);
        }
        catch (error) { }
        return user;
    }
};
UserDataMiddleware = __decorate([
    common_1.Injectable()
], UserDataMiddleware);
exports.UserDataMiddleware = UserDataMiddleware;
//# sourceMappingURL=user-data.middleware.js.map
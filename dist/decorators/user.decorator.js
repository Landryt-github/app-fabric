"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
exports.User = common_1.createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const currentUser = extract_user(request.headers.user) || { id: 'XXX_ANONYMOUS_XXX', name: 'ANONYMOUS' };
    return currentUser;
});
const extract_user = (userString) => {
    let user = undefined;
    try {
        user = JSON.parse(userString);
    }
    catch (error) { }
    return user;
};
//# sourceMappingURL=user.decorator.js.map
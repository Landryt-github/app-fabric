"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        try {
            const status = exception.getStatus ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const data = exception.getData ? exception.getData() : undefined;
            const user = extract_user(request.headers.user);
            const error_response = {
                statusCode: status,
                timestamp: new Date().toISOString(),
                message: exception.response ? exception.response.message || exception.response : exception.message,
                errcode: exception.response ? exception.response.errcode : '',
                data: data,
                path: request.url,
                uid: user ? user.id : undefined,
                method: request.method,
            };
            common_1.Logger.error(`${request.method} ${request.url}`, JSON.stringify(Object.assign(Object.assign({}, error_response), { stack: exception.stack })), 'ExceptionFilter');
            response.status(status).json(error_response);
        }
        catch (error) {
            console.log(`${request.method} ${request.url}`);
            console.log(error);
            response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "UNHANDLED ERROR:" + `${request.method} ${request.url}`,
                message: "Something went wrong"
            });
        }
    }
};
AllExceptionsFilter = __decorate([
    common_1.Catch()
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
const extract_user = (userString) => {
    let user = undefined;
    try {
        user = JSON.parse(userString);
    }
    catch (error) { }
    return user;
};
//# sourceMappingURL=exception.filter.js.map
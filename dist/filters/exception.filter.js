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
        console.log(exception);
        const status = exception.getStatus ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const error_response = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: (exception.response ? exception.response.message : undefined) || exception.message,
            path: request.url,
            uid: request.body.user ? request.body.user.uid : 'anonymous',
            method: request.method
        };
        common_1.Logger.error(`${request.method} ${request.url}`, JSON.stringify(Object.assign(Object.assign({}, error_response), { stack: exception.stack })), 'ExceptionFilter');
        response.status(status).json(error_response);
    }
};
AllExceptionsFilter = __decorate([
    common_1.Catch()
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
//# sourceMappingURL=exception.filter.js.map
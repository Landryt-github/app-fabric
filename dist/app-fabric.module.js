"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppFabricModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFabricModule = void 0;
const common_1 = require("@nestjs/common");
const app_fabric_service_1 = require("./app-fabric.service");
const exception_filter_1 = require("./filters/exception.filter");
const logging_interceptor_1 = require("./interceptor/logging.interceptor");
const auth_guard_1 = require("./guards/auth.guard");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const file_storage_service_1 = require("./services/file-storage.service");
let AppFabricModule = AppFabricModule_1 = class AppFabricModule {
    static register(config) {
        return {
            module: AppFabricModule_1,
            providers: [
                {
                    provide: file_storage_service_1.CONFIG_OPTIONS,
                    useValue: config.storage
                },
                app_fabric_service_1.AppFabricService,
                exception_filter_1.AllExceptionsFilter,
                logging_interceptor_1.LoggingInterceptor,
                auth_guard_1.AuthGuard,
                file_storage_service_1.FileStorageService
            ],
            exports: [app_fabric_service_1.AppFabricService,
                exception_filter_1.AllExceptionsFilter,
                logging_interceptor_1.LoggingInterceptor,
                auth_guard_1.AuthGuard,
                file_storage_service_1.FileStorageService]
        };
    }
};
AppFabricModule = AppFabricModule_1 = __decorate([
    common_1.Module({
        imports: [nestjs_prometheus_1.PrometheusModule.register()]
    })
], AppFabricModule);
exports.AppFabricModule = AppFabricModule;
//# sourceMappingURL=app-fabric.module.js.map
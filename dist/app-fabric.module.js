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
const exception_filter_1 = require("./filters/exception.filter");
const logging_interceptor_1 = require("./interceptor/logging.interceptor");
const auth_guard_1 = require("./guards/auth.guard");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const file_storage_service_1 = require("./services/file-storage.service");
const publish_subscribe_service_1 = require("./services/publish-subscribe.service");
const user_data_middleware_1 = require("./middleware/user-data.middleware");
const storage_aws_1 = require("./services/storage/storage.aws");
let AppFabricModule = AppFabricModule_1 = class AppFabricModule {
    static register(config) {
        return {
            module: AppFabricModule_1,
            imports: [common_1.HttpModule],
            providers: [
                {
                    provide: file_storage_service_1.CONFIG_OPTIONS,
                    useValue: config.storage
                },
                {
                    provide: publish_subscribe_service_1.PUBSUB_OPTIONS,
                    useValue: config.pubsub
                },
                {
                    provide: 'STORAGE',
                    useFactory: () => {
                        return config.storage && config.storage.keyFile ? new storage_aws_1.StorageAws(config.storage) : null;
                    }
                },
                exception_filter_1.AllExceptionsFilter,
                logging_interceptor_1.LoggingInterceptor,
                auth_guard_1.AuthGuard,
                file_storage_service_1.FileStorageService,
                publish_subscribe_service_1.PublishSubscribeService,
                user_data_middleware_1.UserDataMiddleware
            ],
            exports: [
                exception_filter_1.AllExceptionsFilter,
                logging_interceptor_1.LoggingInterceptor,
                auth_guard_1.AuthGuard,
                file_storage_service_1.FileStorageService,
                publish_subscribe_service_1.PublishSubscribeService,
                user_data_middleware_1.UserDataMiddleware
            ]
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
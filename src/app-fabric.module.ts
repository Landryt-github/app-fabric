import { Module, DynamicModule } from '@nestjs/common';
import { AppFabricService } from './app-fabric.service';
import { AllExceptionsFilter } from './filters/exception.filter';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { Config } from './interface/config.interface';
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import {FileStorageService, CONFIG_OPTIONS} from './services/file-storage.service'

@Module({
  imports:[PrometheusModule.register()]
})
export class AppFabricModule {
  static register(config:Config):DynamicModule {
    return {
      module: AppFabricModule,
      providers:[
        {
          provide:CONFIG_OPTIONS,
          useValue:config.storage
        },
        AppFabricService,
        AllExceptionsFilter,
        LoggingInterceptor,
        AuthGuard,
        FileStorageService],
      exports: [AppFabricService,
        AllExceptionsFilter,
        LoggingInterceptor,
        AuthGuard,
        FileStorageService]
    }
  }
}

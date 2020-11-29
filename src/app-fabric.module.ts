import { Module, DynamicModule, HttpService, HttpModule } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/exception.filter';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { AuthGuard,TRole } from './guards/auth.guard';
import { Config } from './interface/config.interface';
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import {FileStorageService, CONFIG_OPTIONS} from './services/file-storage.service'
import { PublishSubscribeService,PUBSUB_OPTIONS } from './services/publish-subscribe.service';
import { UserDataMiddleware } from './middleware/user-data.middleware';
import { StorageAws } from './services/storage/storage.aws';
import { StorageGcp } from './services/storage/storage.gcp';


@Module({
  imports:[PrometheusModule.register()]
})
export class AppFabricModule {
  static register(config:Config):DynamicModule {
    return {
      module: AppFabricModule,
      imports:[HttpModule],
      providers:[
        {
          provide:CONFIG_OPTIONS,
          useValue:config.storage
        },
        {
          provide:PUBSUB_OPTIONS,
          useValue:config.pubsub
        },
        {
          provide:'STORAGE',
          //inject: [StorageAws,StorageGcp],
          useFactory:()=> {
            return config.storage && config.storage.keyFile?new StorageAws(config.storage):null
          }
        },
        //StorageAws,
        AllExceptionsFilter,
        LoggingInterceptor,
        AuthGuard,
        FileStorageService,
        PublishSubscribeService,
        UserDataMiddleware],
      exports: [
        AllExceptionsFilter,
        LoggingInterceptor,
        AuthGuard,
        FileStorageService,
        PublishSubscribeService,
        UserDataMiddleware
      ]
    }
  }
}

import { DynamicModule } from '@nestjs/common';
import { Config } from './interface/config.interface';
export declare class AppFabricModule {
    static register(config: Config): DynamicModule;
}

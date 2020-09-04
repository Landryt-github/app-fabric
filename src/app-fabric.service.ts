import { Injectable } from '@nestjs/common';

@Injectable()
export class AppFabricService {
  getHello(): string {
    return 'Hello World!';
  }
}

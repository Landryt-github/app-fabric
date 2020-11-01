import { NestMiddleware } from '@nestjs/common';
export declare class UserDataMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void;
    private extract_user;
}

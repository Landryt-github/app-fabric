import { HttpService } from "@nestjs/common";
export declare class HttpConnect {
    private httpService;
    private logger;
    private instance;
    constructor(httpService: HttpService);
}

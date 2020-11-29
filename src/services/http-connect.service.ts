import { HttpService, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class HttpConnect {
    private logger: Logger = new Logger(HttpConnect.name);
    private instance:HttpService;
    constructor (private httpService: HttpService) {
        this.instance = httpService;
        this.httpService.axiosRef.interceptors.request.use((config)=> {
            console.log(config); 
            return config; 
        })
    }
}
import { HttpService } from "@nestjs/common";
export declare const PUBSUB_OPTIONS = "PUBSUB_OPTIONS";
export declare class PublishSubscribeService {
    private options;
    private readonly http;
    private readonly logger;
    private pubSubClient;
    constructor(options: any, http: HttpService);
    publishMessage<T>(request: T, topic_name: string | Topics): Promise<any>;
    sendNotification<T extends Notification>(message: Notification): Promise<any>;
    sendNotification_direct<T extends Notification>(message: Notification, endpoint: string): Promise<void>;
}
export declare const enum Topics {
    NOTIFICATION = "notification",
    PAYMENT = "payment"
}
export declare enum Notification_destination {
    EMAIL = "email",
    FACEBOOK = "facebook",
    WHATS_APP = "whatsapp",
    SMS = "sms",
    PUSHNOTIFICATION = "pushnotifiction"
}
export declare class Notification {
    type?: string;
    destination: Notification_destination[];
    template: string;
    body: any;
}

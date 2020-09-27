import { Injectable, Inject, HttpService, Logger } from "@nestjs/common";
import {PubSub} from '@google-cloud/pubsub';
import { Stream } from "stream";
import * as FormData from 'form-data';
import * as fs from 'fs';

export const PUBSUB_OPTIONS = 'PUBSUB_OPTIONS';

@Injectable()
export class PublishSubscribeService {

    private readonly logger = new Logger(PublishSubscribeService.name)
    private pubSubClient;
    constructor(@Inject(PUBSUB_OPTIONS)private options:any,private readonly http:HttpService) {
        this.pubSubClient = new PubSub({
            projectId: options.projectId,
            keyFilename: options.keyFile
        })
    }

    async publishMessage<T> (request:T,topic_name:string | Topics)  {
        const message:string = JSON.stringify(request)
        const dataBuffer = Buffer.from(message);
        const messageId = await this.pubSubClient.topic(topic_name).publish(dataBuffer);
        console.log(`Message ${messageId} published to ${topic_name}.`);
        return messageId;
    }

    async sendNotification<T extends Notification>(message:Notification) {
        return this.publishMessage(message,Topics.NOTIFICATION)
    }

    async sendNotification_direct<T extends Notification>(message:Notification,endpoint:string) {
        //return this.publishMessage(message,Topics.NOTIFICATION)
        let formdata = new FormData();
 

        if(message.body.attachments) {
            message.body.attachments.forEach((item)=> {
                if(item.content && (Buffer.isBuffer(item.content) ||  typeof item.content.on === 'function' )) {
                    let filename = `${Date.now()}_${item.filename}`
                    formdata.append('file', item.content,  {filename:filename,filepath:`./tmp/${filename}`});
                    item.path = `./tmp/${filename}`
                    delete item.content
                }
            });
        }

        formdata.append('notification',JSON.stringify(message))

        this.http.post(endpoint,
            formdata,{
                headers: {
                    ...formdata.getHeaders(),
                    'Content-Type':'multipart/form-data;',
                },
            }).toPromise()
            .catch((error)=>{
                this.logger.error(error)
            })
    }
}

export const enum Topics {
    NOTIFICATION='notification',
    PAYMENT='payment',
}


export enum Notification_destination {
    EMAIL='email',
    FACEBOOK='facebook',
    WHATS_APP='whatsapp',
    SMS='sms',
    PUSHNOTIFICATION='pushnotifiction'

}

export class Notification {
    type?:string;
    destination:Notification_destination[]
    template:string;//Used for finding the template
    body:any
}
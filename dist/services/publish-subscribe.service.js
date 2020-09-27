"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PublishSubscribeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.Notification_destination = exports.PublishSubscribeService = exports.PUBSUB_OPTIONS = void 0;
const common_1 = require("@nestjs/common");
const pubsub_1 = require("@google-cloud/pubsub");
const FormData = require("form-data");
exports.PUBSUB_OPTIONS = 'PUBSUB_OPTIONS';
let PublishSubscribeService = PublishSubscribeService_1 = class PublishSubscribeService {
    constructor(options, http) {
        this.options = options;
        this.http = http;
        this.logger = new common_1.Logger(PublishSubscribeService_1.name);
        this.pubSubClient = new pubsub_1.PubSub({
            projectId: options.projectId,
            keyFilename: options.keyFile
        });
    }
    async publishMessage(request, topic_name) {
        const message = JSON.stringify(request);
        const dataBuffer = Buffer.from(message);
        const messageId = await this.pubSubClient.topic(topic_name).publish(dataBuffer);
        console.log(`Message ${messageId} published to ${topic_name}.`);
        return messageId;
    }
    async sendNotification(message) {
        return this.publishMessage(message, "notification");
    }
    async sendNotification_direct(message, endpoint) {
        let formdata = new FormData();
        if (message.body.attachments) {
            message.body.attachments.forEach((item) => {
                console.log('STREAM:', typeof item.content.on === 'function');
                if (item.content && (Buffer.isBuffer(item.content) || typeof item.content.on === 'function')) {
                    let filename = `${Date.now()}_${item.filename}`;
                    formdata.append('file', item.content, { filename: filename, filepath: `./tmp/${filename}` });
                    item.path = `./tmp/${filename}`;
                    delete item.content;
                }
            });
        }
        formdata.append('notification', JSON.stringify(message));
        this.http.post(endpoint, formdata, {
            headers: Object.assign(Object.assign({}, formdata.getHeaders()), { 'Content-Type': 'multipart/form-data;' }),
        }).toPromise()
            .catch((error) => {
            this.logger.error(error);
        });
    }
};
PublishSubscribeService = PublishSubscribeService_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(exports.PUBSUB_OPTIONS)),
    __metadata("design:paramtypes", [Object, common_1.HttpService])
], PublishSubscribeService);
exports.PublishSubscribeService = PublishSubscribeService;
var Notification_destination;
(function (Notification_destination) {
    Notification_destination["EMAIL"] = "email";
    Notification_destination["FACEBOOK"] = "facebook";
    Notification_destination["WHATS_APP"] = "whatsapp";
    Notification_destination["SMS"] = "sms";
    Notification_destination["PUSHNOTIFICATION"] = "pushnotifiction";
})(Notification_destination = exports.Notification_destination || (exports.Notification_destination = {}));
class Notification {
}
exports.Notification = Notification;
//# sourceMappingURL=publish-subscribe.service.js.map
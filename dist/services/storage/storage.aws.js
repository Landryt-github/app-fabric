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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageAws = exports.CONFIG_OPTIONS = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs = require("fs");
const aws_sdk_1 = require("aws-sdk");
exports.CONFIG_OPTIONS = 'STORAGE_OPTIONS';
let StorageAws = class StorageAws {
    constructor(options) {
        this.options = options;
        const config = JSON.parse(fs.readFileSync(options.keyFile, 'utf-8'));
        this.storage = new aws_sdk_1.S3({
            region: config.region,
            endpoint: new aws_sdk_1.Endpoint(config.endpoint),
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretKey,
            }
        });
    }
    async deleteFile(bucket_name, fileName) {
        return await this.storage.deleteObject({
            Bucket: bucket_name,
            Key: fileName
        }).promise();
    }
    async upload(files, bucket_name, folder_name) {
        if (files && files.length > 0) {
            const promises = files.map((file) => {
                return this.storage.upload({
                    Bucket: bucket_name,
                    Key: `${folder_name}/${file.originalname}`,
                    Body: file.buffer,
                    ContentType: file.mimetype
                }).promise();
            });
            return (await Promise.all(promises)).map((item) => { return item.Key; });
        }
        return Promise.all([]);
    }
    async getReadSignedUrl(bucket_name, filename) {
        const url = this.storage.getSignedUrl('getObject', {
            Bucket: bucket_name,
            Key: filename,
            Expires: Date.now() + 5 * 60 * 1000
        });
        return url;
    }
    async downloadFile(bucket_name, filename, destination) {
        const fileStream = fs.createWriteStream(destination);
        return this.storage.getObject({
            Bucket: bucket_name,
            Key: filename
        }).createReadStream().pipe(fileStream);
    }
    async copyFiles(bucket_name, filenames, destinationFolder) {
        return new Promise(async (resolve, reject) => {
            try {
                const urls = [];
                const copyPromises = filenames.map((filename) => {
                    const destinationFileName = `${destinationFolder}/${path_1.basename(filename)}`;
                    urls.push(destinationFileName);
                    return this.copyFile(bucket_name, filename, destinationFileName);
                });
                const copyResponse = await Promise.all(copyPromises);
                resolve(urls);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async createFolder(bucket_name, folderNames, destinationFolder) {
        return new Promise(async (resolve, reject) => {
            try {
                const urls = [];
                const createFolderPromises = folderNames.map((folderName) => {
                    const destinationName = `${destinationFolder}/${folderName}/`;
                    urls.push(destinationName);
                    return this.storage.putObject({
                        Key: destinationName,
                        Bucket: bucket_name
                    }).promise();
                });
                await Promise.all(createFolderPromises);
                resolve(urls);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async deleteFolder(bucket_name, folderName) {
        let deleteFiles = { Objects: [] };
        let dirFiles = await this.storage.listObjects({
            Bucket: bucket_name,
            Prefix: `${folderName}/`
        }).promise();
        if (dirFiles && dirFiles.Contents.length) {
            dirFiles.Contents.forEach((file) => {
                deleteFiles.Objects.push({ Key: file.Key });
            });
        }
        return await this.storage.deleteObjects({
            Bucket: bucket_name,
            Delete: deleteFiles
        }).promise();
    }
    async copyFile(bucket_name, filename, destinationFilename) {
        return this.storage.copyObject({
            Bucket: bucket_name,
            Key: destinationFilename,
            CopySource: `${bucket_name}/${filename}`
        }).promise();
    }
    async ListFiles(bucket_name, prefix) {
        let options = prefix ? {
            Bucket: bucket_name,
            Prefix: prefix,
        } : null;
        let files = await this.storage.listObjects(options).promise();
        let resultDocs = [];
        files.Contents.forEach((item) => {
            if (item.Size > 0) {
                resultDocs.push({
                    id: item.Key,
                    name: path_1.basename(item.Key),
                    contentType: "",
                    size: item.Size,
                    updatetime: item.LastModified
                });
            }
        });
        return resultDocs;
    }
};
StorageAws = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(exports.CONFIG_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], StorageAws);
exports.StorageAws = StorageAws;
//# sourceMappingURL=storage.aws.js.map
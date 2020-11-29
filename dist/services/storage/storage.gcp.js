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
exports.StorageGcp = exports.CONFIG_OPTIONS = void 0;
const storage_1 = require("@google-cloud/storage");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
exports.CONFIG_OPTIONS = 'STORAGE_OPTIONS';
let StorageGcp = class StorageGcp {
    constructor(options) {
        this.options = options;
        this.storage = new storage_1.Storage({
            projectId: options.projectId,
            keyFilename: options.keyFile
        });
    }
    async upload(files, bucket_name, folder_name) {
        if (files && files.length > 0) {
            const bucket = this.storage.bucket(bucket_name);
            const folder = folder_name;
            const uploadPromises = files.map(file => { return this.uploadDocToStorage(file, bucket, folder); });
            const urls = await Promise.all(uploadPromises);
            return urls;
        }
        return Promise.all([]);
    }
    async getReadSignedUrl(bucket_name, filename) {
        const [url] = await this.storage
            .bucket(bucket_name)
            .file(filename)
            .getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 5 * 60 * 1000
        });
        return url;
    }
    async downloadFile(bucket_name, filename, destination) {
        return await this.storage.bucket(bucket_name).file(filename).download({
            destination: destination
        });
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
                    let contents = Buffer.alloc(0);
                    return this.storage.bucket(bucket_name).file(destinationName).save(contents);
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
        let options = {
            prefix: `${folderName}/`,
        };
        let dirFiles = await this.storage.bucket(bucket_name).getFiles(options);
        if (dirFiles.length) {
            dirFiles[0].forEach((file) => {
                file.delete().catch();
            });
        }
        return;
    }
    async enable_cors(bucket_name) {
        await this.storage.bucket(bucket_name).setCorsConfiguration([
            {
                maxAgeSeconds: 3600,
                method: ['GET', 'OPTIONS'],
                origin: ['*'],
                responseHeader: ['*'],
            },
        ]);
    }
    async copyFile(bucket_name, filename, destinationFilename) {
        return this.storage.bucket(bucket_name).file(filename).copy(this.storage.bucket(bucket_name).file(destinationFilename));
    }
    async ListFiles(bucket_name, prefix) {
        let options = prefix ? {
            prefix: prefix,
        } : null;
        const [files] = await this.storage.bucket(bucket_name).getFiles(options);
        let resultDocs = [];
        files.forEach((file, index) => {
            if (file.metadata.size > 0) {
                resultDocs.push({
                    id: file.id,
                    name: file.name,
                    contentType: file.metadata.contentType,
                    size: file.metadata.size,
                    updatetime: file.metadata.updated
                });
            }
        });
        return resultDocs;
    }
    async uploadDocToStorage(fileObj, bucket, folder) {
        return new Promise((resolve, reject) => {
            let fileUpload = bucket.file(`${folder}/${fileObj.originalname}`);
            let blobStream = fileUpload.createWriteStream({ metadata: { contentType: fileObj.mimetype } });
            blobStream.on('error', (error) => {
                console.log(error);
                reject(new Error('Something is wrong! Unable to upload at the moment.'));
            });
            blobStream.on('finish', () => {
                const url = fileUpload.name;
                resolve(url);
            });
            blobStream.end(fileObj.buffer);
        });
    }
};
StorageGcp = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(exports.CONFIG_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], StorageGcp);
exports.StorageGcp = StorageGcp;
//# sourceMappingURL=storage.gcp.js.map
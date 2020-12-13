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
exports.FileStorageService = exports.CONFIG_OPTIONS = void 0;
const common_1 = require("@nestjs/common");
exports.CONFIG_OPTIONS = 'STORAGE_OPTIONS';
let FileStorageService = class FileStorageService {
    constructor(storage) {
        this.storage = storage;
    }
    async upload(files, bucket_name, folder_name) {
        return this.storage.upload(files, bucket_name, folder_name);
    }
    async getReadSignedUrl(bucket_name, filename) {
        return this.storage.getReadSignedUrl(bucket_name, filename);
    }
    async downloadFile(bucket_name, filename, destination) {
        return this.storage.downloadFile(bucket_name, filename, destination);
    }
    async copyFiles(bucket_name, filenames, destinationFolder) {
        return this.storage.copyFiles(bucket_name, filenames, destinationFolder);
    }
    async createFolder(bucket_name, folderNames, destinationFolder) {
        return this.storage.createFolder(bucket_name, folderNames, destinationFolder);
    }
    async deleteFolder(bucket_name, folderName) {
        return this.storage.deleteFolder(bucket_name, folderName);
    }
    async deleteFile(bucket_name, fileName) {
        return this.storage.deleteFile(bucket_name, fileName);
    }
    async ListFiles(bucket_name, prefix) {
        return this.storage.ListFiles(bucket_name, prefix);
    }
    async uploadBase64Image(bucket_name, file, fileName) {
        return this.storage.uploadBase64Image(bucket_name, file, fileName);
    }
};
FileStorageService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('STORAGE')),
    __metadata("design:paramtypes", [Object])
], FileStorageService);
exports.FileStorageService = FileStorageService;
//# sourceMappingURL=file-storage.service.js.map
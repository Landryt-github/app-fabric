import { Storage, Bucket } from '@google-cloud/storage';
export declare const CONFIG_OPTIONS = "STORAGE_OPTIONS";
export declare class FileStorageService {
    private options;
    storage: Storage;
    constructor(options: any);
    upload(files: [], bucket_name: string, folder_name: string): Promise<string[]>;
    uploadDocToStorage(fileObj: any, bucket: Bucket, folder: string): Promise<string>;
}

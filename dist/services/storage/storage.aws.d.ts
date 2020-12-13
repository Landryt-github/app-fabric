/// <reference types="node" />
import { StorageService } from './storage';
import * as fs from 'fs';
import { S3 } from 'aws-sdk';
export declare const CONFIG_OPTIONS = "STORAGE_OPTIONS";
export declare class StorageAws implements StorageService {
    private options;
    private storage;
    constructor(options: any);
    deleteFile(bucket_name: string, fileName: string): Promise<any>;
    upload(files: [], bucket_name: string, folder_name: string): Promise<string[]>;
    getReadSignedUrl(bucket_name: string, filename: string): Promise<string>;
    downloadFile(bucket_name: string, filename: string, destination: string): Promise<fs.WriteStream>;
    copyFiles(bucket_name: string, filenames: string[], destinationFolder: string): Promise<string[]>;
    createFolder(bucket_name: string, folderNames: string[], destinationFolder: string): Promise<string[]>;
    deleteFolder(bucket_name: string, folderName: string): Promise<import("aws-sdk/lib/request").PromiseResult<S3.DeleteObjectsOutput, import("aws-sdk").AWSError>>;
    copyFile(bucket_name: string, filename: string, destinationFilename: string): Promise<import("aws-sdk/lib/request").PromiseResult<S3.CopyObjectOutput, import("aws-sdk").AWSError>>;
    ListFiles(bucket_name: string, prefix?: string): Promise<any[]>;
    uploadBase64Image(bucket_name: string, file: string, fileName: string): Promise<string>;
}

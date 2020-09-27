export declare const CONFIG_OPTIONS = "STORAGE_OPTIONS";
export declare class FileStorageService {
    private options;
    private storage;
    constructor(options: any);
    upload(files: [], bucket_name: string, folder_name: string): Promise<string[]>;
    getReadSignedUrl(bucket_name: string, filename: string): Promise<string>;
    getFile(bucket_name: string, filename: string): Promise<void>;
    createWriteStream(bucket_name: string, filename: string): Promise<void>;
    downloadFile(bucket_name: string, filename: string, destination: string): Promise<import("@google-cloud/storage").DownloadResponse>;
    private uploadDocToStorage;
}

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
    copyFiles(bucket_name: string, filenames: string[], destinationFolder: string): Promise<string[]>;
    createFolder(bucket_name: string, folderNames: string[], destinationFolder: string): Promise<string[]>;
    deleteFolder(bucket_name: string, folderName: string): Promise<void>;
    enable_cors(bucket_name: string): Promise<void>;
    copyFile(bucket_name: string, filename: string, destinationFilename: string): Promise<import("@google-cloud/storage").CopyResponse>;
    ListFiles(bucket_name: string, prefix?: string): Promise<import("@google-cloud/storage").GetFilesResponse>;
    private uploadDocToStorage;
}

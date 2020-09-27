import {Storage, Bucket} from '@google-cloud/storage';
import { Injectable, Inject } from "@nestjs/common";

export const CONFIG_OPTIONS = 'STORAGE_OPTIONS';

@Injectable()
export class FileStorageService {
    private storage: Storage;

    constructor(@Inject(CONFIG_OPTIONS)private options:any){
        this.storage = new Storage({
            projectId: options.projectId,
            keyFilename: options.keyFile
          });
    }

    async upload(files:[],bucket_name:string,folder_name:string):Promise<string[]> {
        if(files && files.length>0) {
          const bucket = this.storage.bucket(bucket_name);
          const folder = folder_name
          const uploadPromises:Promise<string>[] =files.map(file => {return this.uploadDocToStorage(file,bucket,folder)});
          const urls = await Promise.all(uploadPromises)
          return urls;
        }
        return Promise.all([])
    }

    async  getReadSignedUrl(bucket_name:string,filename: string) {
        const [url] = await this.storage
                          .bucket(bucket_name)
                          .file(filename)
                          .getSignedUrl({
                            version:"v4",
                            action: "read",
                            expires: Date.now() + 5 * 60 * 1000
                          });

        return url;
    }

    async getFile(bucket_name:string,filename: string) {
      const file =await this.storage
                        .bucket(bucket_name)
                        .file(filename);
   
    }

    async createWriteStream(bucket_name:string,filename: string) {
      const writestream =await this.storage
                        .bucket(bucket_name)
                        .file(filename)
                        .createWriteStream()
    }

    
    async downloadFile(bucket_name:string,filename: string,destination:string) {
      return await this.storage.bucket(bucket_name).file(filename).download({
        destination:destination
      })
    }

    private async uploadDocToStorage(fileObj: any,bucket:Bucket,folder:string): Promise<string> {

        return new Promise((resolve, reject) => {
          let fileUpload = bucket.file(`${folder}/${fileObj.originalname}`);
          let blobStream = fileUpload.createWriteStream({metadata: {contentType: fileObj.mimetype}});
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
}
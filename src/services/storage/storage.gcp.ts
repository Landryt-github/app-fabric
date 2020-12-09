import {Storage, Bucket, File} from '@google-cloud/storage';
import { Injectable, Inject } from "@nestjs/common";
import {basename} from 'path';
import { StorageService } from './storage';
export const CONFIG_OPTIONS = 'STORAGE_OPTIONS';

@Injectable()
export class StorageGcp implements StorageService {
    private storage: Storage;

    constructor(@Inject(CONFIG_OPTIONS)private options:any){
        this.storage = new Storage({
            projectId: options.projectId,
            keyFilename: options.keyFile
          });
    }

    async deleteFile(bucket_name: string, fileName: string): Promise<any> {
      await this.storage.bucket(bucket_name).file(fileName).delete();
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

    async  getReadSignedUrl(bucket_name:string,filename: string):Promise<string> {
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

    /*async getFile(bucket_name:string,filename: string) {
      const file =await this.storage
                        .bucket(bucket_name)
                        .file(filename);
   
    }*/

    /*async createWriteStream(bucket_name:string,filename: string) {
      const writestream =await this.storage
                        .bucket(bucket_name)
                        .file(filename)
                        .createWriteStream()
    }*/

    
    async downloadFile(bucket_name:string,filename: string,destination:string) {
      return await this.storage.bucket(bucket_name).file(filename).download({
        destination:destination
      })
    }

    async copyFiles(bucket_name:string,filenames: string[],destinationFolder:string):Promise<string[]>{
        return new Promise(async (resolve,reject)=>{
          try {
                const urls:string[] = []; 
                const copyPromises = filenames.map((filename)=>{
                  const destinationFileName =`${destinationFolder}/${basename(filename)}` ;
                    urls.push(destinationFileName)
                    return this.copyFile(bucket_name,filename,destinationFileName);
                });
                const copyResponse = await Promise.all(copyPromises);
                resolve(urls)
              }
              catch(error) {
                reject(error)
              }
        });
    }

    async createFolder(bucket_name:string,folderNames:string[],destinationFolder:string):Promise<string[]> {
        return new Promise(async (resolve,reject)=>{
          try {
                const urls:string[] = []; 
                const createFolderPromises = folderNames.map((folderName)=> {
                  const destinationName =`${destinationFolder}/${folderName}/` ;
                  urls.push(destinationName)
                  let contents=Buffer.alloc(0)
                  return this.storage.bucket(bucket_name).file(destinationName).save(contents)
                })
                await Promise.all(createFolderPromises);
                resolve(urls)
          }
          catch(error) {
            reject(error)
          }
        })
    }


    async deleteFolder(bucket_name:string,folderName:string) {
      let options = {
        prefix:`${folderName}/`,
      };
      let dirFiles = await this.storage.bucket(bucket_name).getFiles(options);
      if(dirFiles.length) {
        dirFiles[0].forEach((file:File) => {
         file.delete().catch()
       });
      }
       
     
      //await Promise.all(delFilesPromise);
      return 
    }

    async enable_cors(bucket_name:string) {
      await this.storage.bucket(bucket_name).setCorsConfiguration([
        {
          maxAgeSeconds:3600,
          method: ['GET','OPTIONS'],
          origin: ['*'],
          responseHeader: ['*'],
        },
      ]);
    }

    async copyFile(bucket_name:string,filename: string,destinationFilename:string) {
      return this.storage.bucket(bucket_name).file(filename).copy(this.storage.bucket(bucket_name).file(destinationFilename))
    }

    async ListFiles(bucket_name:string,prefix?:string) {
        let options =prefix? {
          prefix:prefix,
          //delimiter:'/'
        }:null

        const [files] = await this.storage.bucket(bucket_name).getFiles(options)
        let resultDocs = [];
        files.forEach((file,index)=> {
          if(file.metadata.size > 0) {
              resultDocs.push({
                  id:file.id,
                  name:file.name,
                  contentType: file.metadata.contentType,
                  size: file.metadata.size,
                  updatetime:file.metadata.updated
              })
          }
      });

      return resultDocs;
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
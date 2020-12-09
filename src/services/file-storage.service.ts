
import { Injectable, Inject } from "@nestjs/common";
import { StorageService } from './storage/storage';
export const CONFIG_OPTIONS = 'STORAGE_OPTIONS';


@Injectable()
export class FileStorageService {
  

    constructor(@Inject('STORAGE') private storage:StorageService){
        
    }

    async upload(files:[],bucket_name:string,folder_name:string):Promise<string[]> {
      return this.storage.upload(files,bucket_name,folder_name,)
    }

    async  getReadSignedUrl(bucket_name:string,filename: string) {
        return this.storage.getReadSignedUrl(bucket_name,filename)
    }

    /*async getFile(bucket_name:string,filename: string) {
      return this.storage.getFile(bucket_name,filename)
   
    }*/

    /*async createWriteStream(bucket_name:string,filename: string) {
      return this.storage.createWriteStream(bucket_name,filename)
    }*/

    
    async downloadFile(bucket_name:string,filename: string,destination:string) {
      return this.storage.downloadFile(bucket_name,filename,destination)
    }

    async copyFiles(bucket_name:string,filenames: string[],destinationFolder:string):Promise<string[]>{
        return this.storage.copyFiles(bucket_name,filenames,destinationFolder)
    }

    async createFolder(bucket_name:string,folderNames:string[],destinationFolder:string):Promise<string[]> {
        return this.storage.createFolder(bucket_name,folderNames,destinationFolder)
    }


    async deleteFolder(bucket_name:string,folderName:string) {
      return this.storage.deleteFolder(bucket_name,folderName)
    }

    async deleteFile(bucket_name:string,fileName:string) {
      return this.storage.deleteFile(bucket_name,fileName)
    }

    async ListFiles(bucket_name:string,prefix?:string) {
      return this.storage.ListFiles(bucket_name,prefix)
    }
    
    /*async copyFile(bucket_name:string,filename: string,destinationFilename:string) {
      return this.storage.copyFile(bucket_name,filename,destinationFilename)
    }*/

    
}
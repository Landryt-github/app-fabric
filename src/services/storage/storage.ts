import {Storage, Bucket, File} from '@google-cloud/storage';
import { Injectable, Inject } from "@nestjs/common";
import {basename} from 'path';
export const CONFIG_OPTIONS = 'STORAGE_OPTIONS';



export interface StorageService {
   
      upload(files:[],bucket_name:string,folder_name:string):Promise<string[]>;
      getReadSignedUrl(bucket_name:string,filename: string):Promise<string>;
      //getFile(bucket_name:string,filename: string):Promise<any>;
      //createWriteStream(bucket_name:string,filename: string):Promise<any>;
      downloadFile(bucket_name:string,filename: string,destination:string):Promise<any>;
      copyFiles(bucket_name:string,filenames: string[],destinationFolder:string):Promise<string[]>;
      createFolder(bucket_name:string,folderNames:string[],destinationFolder:string):Promise<string[]> ;
      deleteFolder(bucket_name:string,folderName:string):Promise<any>;
      deleteFile(bucket_name:string,fileName:string):Promise<any>;
      //copyFile(bucket_name:string,filename: string,destinationFilename:string):Promise<any>;
      ListFiles(bucket_name:string,prefix?:string):Promise<any>;
      uploadBase64Image(bucket_name:string,file:string,fileName:string):Promise<any>
}
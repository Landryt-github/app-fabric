import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import {basename,extname} from 'path';
import { StorageService } from './storage';
import * as fs from 'fs';
import {S3,Endpoint} from 'aws-sdk';
//import {PassThrough} from 'stream';

export const CONFIG_OPTIONS = 'STORAGE_OPTIONS';


@Injectable()
export class StorageAws implements StorageService {
    private storage: S3;

    constructor(@Inject(CONFIG_OPTIONS)private options:any){
        const config = JSON.parse(fs.readFileSync(options.keyFile,'utf-8'));
        this.storage = new S3({
          region: config.region,
          endpoint: new Endpoint(config.endpoint),
          credentials:{
            accessKeyId:config.accessKeyId,
            secretAccessKey:config.secretKey,
          }
        })
    }

    async deleteFile(bucket_name: string, fileName: string): Promise<any> {
      return await this.storage.deleteObject({
        Bucket:bucket_name,
        Key:fileName
      }).promise()
    }

    async upload(files:[],bucket_name:string,folder_name:string):Promise<string[]> {
        if(files && files.length>0) {
          //const folder = folder_name;
          const promises = files.map((file:any)=> {
            return this.storage.upload({
              Bucket:bucket_name,
              Key:`${folder_name}/${file.originalname}`,
              Body:file.buffer,
              ContentType:file.mimetype
            }).promise()
          })
          return (await Promise.all(promises)).map((item)=> {return item.Key})
        }
        return Promise.all([])
    }

    async  getReadSignedUrl(bucket_name:string,filename: string):Promise<string> {
        const url = this.storage.getSignedUrl('getObject',{
          Bucket: bucket_name,
          Key: filename,
          Expires: Date.now() + 5 * 60 * 1000
        })
        return url;
    }

    /*async getFile(bucket_name:string,filename: string) {
      const file =await this.storage.getObject({
        Bucket:bucket_name,
        Key:filename
      }).promise()
    }*/

    /*async createWriteStream(bucket_name:string,filename: string) {
        let pass = new PassThrough();
        this.storage.upload({
          Bucket:bucket_name,
          Key:filename,
          Body:PassThrough
        })

        return pass;
    }*/

    
    async downloadFile(bucket_name:string,filename: string,destination:string) {
      const fileStream = fs.createWriteStream(destination)
      return this.storage.getObject({
        Bucket:bucket_name,
        Key:filename
      }).createReadStream().pipe(fileStream)
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
                  
                  return this.storage.putObject({
                    Key:destinationName,
                    Bucket:bucket_name
                  }).promise()
                })
                await Promise.all(createFolderPromises);
                resolve(urls)
          }
          catch(error) {
            reject(error)
          }
        })
    }

//fra1.digitaloceanspaces.com
//landryt-alphadatabackup
    async deleteFolder(bucket_name:string,folderName:string) {
      let deleteFiles ={Objects:[]};
      let dirFiles = await this.storage.listObjects({
        Bucket:bucket_name,
        Prefix:`${folderName}/`
      }).promise()
      if(dirFiles && dirFiles.Contents.length) {
        dirFiles.Contents.forEach((file) => {
          deleteFiles.Objects.push({Key:file.Key})
       });
      }

      return await this.storage.deleteObjects({
                      Bucket: bucket_name,
                      Delete:deleteFiles
                    }).promise()

    }


    async copyFile(bucket_name:string,filename: string,destinationFilename:string) {

      return this.storage.copyObject({
                Bucket:bucket_name,
                Key:destinationFilename,
                CopySource:`${bucket_name}/${filename}`
              }).promise()
    }

    async ListFiles(bucket_name:string,prefix?:string) {
        let options =prefix? {
          Bucket:bucket_name,
          Prefix:prefix,
          //delimiter:'/'
        }:null

        let files = await this.storage.listObjects(options).promise();
        let resultDocs = [];
        files.Contents.forEach((item)=> {
          if(item.Size>0) {
            resultDocs.push({
              id:item.Key,
              name:basename(item.Key),
              contentType: "",
              size:item.Size,
              updatetime:item.LastModified
            })
          }
        });

        return resultDocs;
    }


    
}
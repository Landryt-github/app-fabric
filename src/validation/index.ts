import { IsMongoId, IsNumberString, IsString } from 'class-validator';
export class MongoIdParam {
    @IsMongoId()
    id:string
}

export class StringIdParam {
    @IsString()
    id:string
}

export class NumberIdParam {
    @IsNumberString()
    id:string
}
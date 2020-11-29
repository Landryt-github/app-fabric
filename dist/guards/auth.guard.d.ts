import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
export declare class AuthGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
export declare enum TRole {
    ADMIN_TENANT = "admin",
    STAFF_TENANT = "staff",
    ADMIN_OPS = "admin_ops",
    PARTNER = "partner",
    SUPER_ADMIN = "owner"
}

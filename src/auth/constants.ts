import { SetMetadata } from "@nestjs/common";
require('dotenv').config()
export const JwtContstant = {
    expire: process.env.JWT_ACCESS_EXPIRE,
    secret: process.env.JWT_ACCESS_SECRET
};

export const JwtRefreshContstant = {
    expire: process.env.JWT_REFRESH_EXPIRE,
    secret: process.env.JWT_REFRESH_SECRET
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IgnoredPropertyName = Symbol('IgnoredPropertyName');
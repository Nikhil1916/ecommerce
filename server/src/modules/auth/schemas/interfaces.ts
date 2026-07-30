
export interface JwtPayload {
    sub: string;
    email: string;
}


import { RefreshToken } from "@prisma/client";


interface RefreshTokenPayload {
    sub: string;
    jti: string;
}


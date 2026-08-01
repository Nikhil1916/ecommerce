import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { User } from ".prisma/client";
class JWTService {
   verifyAccessToken(accessToken: string): AccessTokenPayload {
    return jwt.verify(
      accessToken,
      config.JWT_ACCESS_SECRET,
    ) as AccessTokenPayload;
  }

   verifyRefreshToken(refreshToken: string): JwtPayload {
    return jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as JwtPayload;
  }

   generateRefreshToken(user: User, jti: string): string {
    const secret: jwt.Secret = config.JWT_REFRESH_SECRET as jwt.Secret;
    const options: jwt.SignOptions = {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    };
    return jwt.sign(
      {
        sub: user.id,
        jti,
      },
      secret,
      options,
    );
  }

   generateAccessToken(user: User): string {
    // Cast secret and expiresIn to the types expected by jsonwebtoken
    const secret: jwt.Secret = config.JWT_ACCESS_SECRET as jwt.Secret;
    const options: jwt.SignOptions = {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    };

    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      secret,
      options,
    );
  }
}

const jwtService = new JWTService();
export { jwtService, JWTService };

export interface AccessTokenPayload extends JwtPayload {
    sub: string;
}


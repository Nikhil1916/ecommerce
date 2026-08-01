import "express";

declare module "express-serve-static-core" {
  interface Request {
    requestId: string;
     user?: AuthenticatedUser;
  }
}

export interface AuthenticatedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
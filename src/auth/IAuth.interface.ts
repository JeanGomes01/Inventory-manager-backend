export interface IAuthenticatedUser {
  id: number;
  email: string;
}

export interface IJwtPayload {
  sub: number;
  email: string;
}

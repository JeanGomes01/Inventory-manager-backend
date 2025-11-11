export interface IAuthenticatedUser {
  id: number;
  name: string;
  email: string;
}

export interface IJwtPayload {
  sub: number;
  email: string;
}

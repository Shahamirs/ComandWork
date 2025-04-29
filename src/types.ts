export interface IAuth {
  username: string
  password: string
  password_confirm?: string
}
export interface IUser {
  id: number | null;
  username: string | null
  accessToken: string | null;
  refreshToken: string | null;
}
export interface User {
  username: string
  password: string
}

export interface SignedIn {
  user: User,
  accessToken: string,
  refreshToken: string
}

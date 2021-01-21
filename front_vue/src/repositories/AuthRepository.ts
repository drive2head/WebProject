import {User} from "src/types/User";
import {Client} from "src/api-client/api-client";

export const AuthRepository = {
  async logIn(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    // return await Client.post<User>('signin', user)
    return await Client.post<User>('signin', user)
  },
  async logOut() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    return await Client.post<User>('signout')
  }
}

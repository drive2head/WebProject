import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from 'src/store'
import {User} from "src/types/User";
import {AuthRepository} from "src/repositories/AuthRepository";

export const vuexKey = 'vuex';

function checkIfInStore(name: string) {
  const vuex = window.localStorage.getItem(vuexKey);
  if (vuex != null) {
    try {
      const parsed = JSON.parse(vuex);
      return parsed[name] != null;
    } catch (e) {
      return false;
    }
  }
  return false;
}


@Module({
  name: 'user',
  dynamic: true,
  store,
  preserveState: checkIfInStore('user'),
})

class UserModule extends VuexModule {
  loggedIn = false
  info: User | null = null
  permissions: string[] = []

  @Action({rawError: true})
  async logIn(user: User) {
    try {
      const info = await AuthRepository.logIn(user)
      this.LOG_IN(info.data)
      return true
    } catch (e) {
      // TODO error handler
      console.log(e)
      return false
    }
  }

  @Action({ rawError: true })
  async logOut() {
    this.LOG_OUT()
    try {
      await AuthRepository.logOut()
    } catch (e) {}
  }

  @Mutation
  private LOG_IN(info: User) {
    this.info = info
    this.loggedIn = true
  }

  @Mutation
  private LOG_OUT() {
    this.info = null
    this.loggedIn = false
    this.permissions = []
  }
}

export default UserModule

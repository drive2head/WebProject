<template>
  <div class="main-block">
    <q-form class="login-block" @submit="submitHandler">
      <styled-input :value="user.username.trim()" @input="value => user.username = value" label="Логин" required />
      <styled-input :value="user.password.trim()" @input="value => user.password = value" label="Пароль" type="password" required />
      <div style="display: flex; justify-content: space-between" >
<!--        <styled-btn label="Зарегистрироваться" type="submit" />-->
        <span />
        <styled-btn label="Войти" type="submit" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref} from "@vue/composition-api";
  import StyledInput from "components/base/StyledInput.vue";
  import StyledBtn from "components/base/StyledBtn.vue";
  import {User} from "src/types/User";
  import {AuthRepository} from "src/repositories/AuthRepository";

  export default defineComponent({
    name: 'LoginForm',
    components: {
      StyledInput,
      StyledBtn,
    },
    setup(props, context) {

      const user = ref<User>({username: '', password: ''})
      const loading = ref(false)

      function submitHandler() {
        loading.value = true
        console.log('submit', user.value)
        AuthRepository.logIn(user)
          .then((result: User) => {
            console.log('result', result)
            if (result) {
              const redirect = context.root.$route.query.redirect as string
              if (redirect) {
                context.root.$router.push({
                  path: redirect,
                })
              } else {
                context.root.$router.push(defaultRouteForRole(StoreEmployee.permissions))
              }
            }
          })
          .finally(() => {
            loading.value = false
          })
      }

      return {
        user,
        loading,

        submitHandler,
      }
    }
  })
</script>

<style lang="scss" scoped>

  .main-block {
    display: flex;
    justify-content: center;
  }

  .login-block {
    width: 500px;
    height: 500px;
    position: center;
  }

</style>

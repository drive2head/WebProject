<template>
  <div class="main-block">
    <q-form @submit="submitHandler">
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

  export default defineComponent({
    name: 'LoginForm',
    components: {
      StyledInput,
      StyledBtn,
    },
    setup() {

      const user = ref<User>({username: '', password: ''})

      function submitHandler() {
        console.log("submit")
      }

      return {
        user,

        submitHandler,
      }
    }
  })
</script>

<style lang="scss" scoped>

</style>

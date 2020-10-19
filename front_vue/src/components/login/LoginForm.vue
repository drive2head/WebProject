<template>
  <div class="main-block">
    <q-form @submit="submetHandler">
      <div class="flex-row">
      <span>Логин: </span>
      <styled-input required />
    </div>
      <div class="flex-row">
        <span>Пароль: </span>
        <styled-input password required />
      </div>
      <styled-btn @click="submitHandler" label="Войти" />
    </q-form>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "@vue/composition-api";
  import StyledInput from "components/base/StyledInput.vue";
  import StyledBtn from "components/base/StyledBtn.vue";

  export default defineComponent({
    name: 'LoginForm',
    components: {
      StyledInput,
      StyledBtn,
    },
    setup() {

      function submitHandler() {
        console.log("submit")
      }

      return {

        submitHandler,

      }
    }
  })
</script>

<style lang="scss" scoped>

</style>

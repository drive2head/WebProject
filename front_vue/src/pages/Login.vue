<template>
  <login-form />
</template>

<script lang="ts">
  import { defineComponent } from 'app/node_modules/@vue/composition-api';
  import LoginForm from "components/login/LoginForm.vue";

  export default defineComponent({
    name: 'Login',
    components: {
      LoginForm,
    },
  })


</script>

<style lang="scss" scoped>

</style>

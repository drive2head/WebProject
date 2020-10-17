<template>
  <div class="main-container">
    <styled-btn :label="label" @btnClicked="btnHandler" />
    <styled-btn :label="label" deleteBtn :step="-1" @btnClicked="btnHandler" />
    <p class="main-container--label-block"> {{ label }} </p>
    <p class="main-container--label-block"> {{ counter }} </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'app/node_modules/@vue/composition-api';
  import StyledBtn from 'components/base/StyledBtn.vue';

  export default defineComponent({
    name: 'Login',
    components: {
      StyledBtn,
    },
    props: {
    },
    setup(props, context) {

      const label = ref('Привет')
      const counter = ref(0)

      function btnHandler(value: number) {
        counter.value -= value
      }

      return {
        label,
        counter,

        btnHandler,
      }
    }
  })


</script>

<style lang="scss" scoped>

  .main-container {
    display: flex;
    justify-content: space-around;
    margin: 100px;
    padding: 100px 50px;
    height: calc(100vh - 500px);
    border: #9C27B0 5px solid;
    /*display: flex;*/
    /*justify-content: center;*/

    &--label-block {
      padding: 0;
      margin: 30px;
      font-size: 30px;
      color: #21BA45;
    }
  }

</style>

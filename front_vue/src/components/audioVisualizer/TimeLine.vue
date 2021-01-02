<template>
  <div>
    <canvas id="timeline" ref="timeline" style="background-color: #ffdddd; width: 100%; height: 30px" />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "app/node_modules/@vue/composition-api";

  export default defineComponent({
    name: 'TimeLine',
    components: {

    },
    props: {
      scale: {
        type: Number,
        default: 1
      }
    },
    setup(props, context) {

      return {
      }
    },
  })

</script>

<style lang="scss" scoped>

</style>

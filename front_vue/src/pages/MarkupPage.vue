<template>
  <markup style="margin: 20px" />
</template>

<script lang="ts">
  import { defineComponent } from 'app/node_modules/@vue/composition-api';
  import Markup from "components/markup/Markup.vue";

  export default defineComponent({
    name: 'MarkupPage',
    components: {
      Markup,
    },
  })


</script>

<style lang="scss" scoped>

</style>

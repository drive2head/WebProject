<template>
  <div>
    <div>Виджет:</div>
    <audio-visualizer src="''" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'app/node_modules/@vue/composition-api';
  import AudioVisualizer from "components/audioVisualizer/AudioVisualizer.vue";

  export default defineComponent({
    name: 'Markup',
    components: {
      AudioVisualizer
    },
  })


</script>

<style lang="scss" scoped>

</style>

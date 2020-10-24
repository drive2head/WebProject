<template>
  <canvas id="visualizer" style="background-color: #00a5c3; width: 100%" />
</template>

<script lang="ts">
  import {defineComponent} from "app/node_modules/@vue/composition-api";
  import {AudioVisualizer} from "components/audioVisualizer/AudioVisualizer";

  export default defineComponent({
    name: 'AudioVisualizer',
    components: {

    },
    props: {
      src: {
        type: String,
        default: null
      }
    },
    setup(props, context) {

      let audioVisualizer: AudioVisualizer | null = null

      function drawAudioVisualization() {
        const canvas = document.getElementById('visualizer') as HTMLCanvasElement
        if (canvas) {
          const ctx = canvas.getContext('2d')
          console.log(ctx)
          if (ctx)
            audioVisualizer = new AudioVisualizer(ctx)

          // TODO

        }
      }
      drawAudioVisualization()

      return {
        drawAudioVisualization,
      }
    },
  })

</script>

<style lang="scss" scoped>

</style>

<template>
  <div>
    <canvas id="visualizer" ref="visualizer" style="background-color: #00a5c3; width: 100%; height: 100px" />
<!--    <time-line />-->
<!--    <q-slider />-->
    <audio id="source" ref="source" :src="src" controls="controls" @onload="alert('ended')"/>
  </div>
</template>

<script lang="ts">
  import {defineComponent, PropType, ref, watch} from "app/node_modules/@vue/composition-api";
  import {AudioVisualizer} from "components/audioVisualizer/AudioVisualizer";
  import {AudioSection} from "src/types/AudioVisualizer";
  import TimeLine from "components/audioVisualizer/TimeLine.vue";

  export default defineComponent({
    name: 'AudioVisualizer',
    components: {
      TimeLine,
    },
    props: {
      src: {
        type: String,
        default: null
      },
      backgroundColor: {
        type: String,
        default: '#fff'
      },
      selectionColor: {
        type: String,
        default: '#000'
      },
      selectedColor: {
        type: String,
        default: '#abc'
      },
      selected: {
        type: Array as PropType<AudioSection[]>,
        default: () => []
      }
    },
    setup(props, context) {

      let audioVisualizer: AudioVisualizer | null = null

      const source = ref<HTMLMediaElement | null>(null)


      watch(source, () => {
        console.log(source.value)
        let audioCtx = new AudioContext();
        let analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        let audioSource = audioCtx.createMediaElementSource(source.value);
        audioSource.connect(analyser);
        audioSource.connect(audioCtx.destination);
        let data = new Uint8Array(analyser.frequencyBinCount);
        console.log(data)
      })


      function drawAudioVisualization() {
        // const canvas = document.getElementById('visualizer') as HTMLCanvasElement
        // const ctx = canvas.getContext('2d')!
      }
      drawAudioVisualization()

      return {
        drawAudioVisualization,
        source,
      }
    },
  })

</script>

<style lang="scss" scoped>

</style>

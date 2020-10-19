<script lang="ts">
  import { QBtn } from 'quasar'
  import { defineComponent } from '@vue/composition-api'

  export default defineComponent({
    name: 'StyledBtn',
    extends: QBtn,
    props: {
      label: String,
      outline: Boolean,
      unelevated: {
        type: Boolean,
        default: true,
      },
      noCaps: {
        type: Boolean,
        default: true,
      },
      color: {
        type: String,
        default: 'button',
      },
    },
  })
</script>

<style lang="scss" scoped>

  .q-btn {
    .q-icon {
      font-size: 32px;
    }
    background: #26A69A;
    color: white;
  }

</style>

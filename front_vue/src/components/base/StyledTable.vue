<template>
  <q-input
    :placeholder="label"
    :value="value"
    v-bind="$attrs"
    v-on="$listeners"
    :rules="innerRules"
    class="styled-input__q-input col-grow"
    input-class="styled-input__input"
    color="input"
    bg-color="input"
    :rows="rows"
    dense
    bottom-slots
    ref="focusInput"
  >
    <!--suppress JSUnusedLocalSymbols -->
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
    <!--suppress JSUnusedLocalSymbols -->
    <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </q-input>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, ref } from '@vue/composition-api'
  import requiredRule from 'src/utils/rules/requiredRule'
  import { QInput } from 'quasar'

  type FunctionRule = (val: any) => boolean | string

  export default defineComponent({
    name: 'StyledInput',
    // extends: QInput,
    props: {
      label: {
        type: String,
      },
      value: {
        type: [String, Number],
      },
      required: {
        type: Boolean,
        default: false,
      },
      requiredLabel: {
        type: Boolean,
        default: false,
      },
      rules: {
        type: Array as PropType<FunctionRule[]>,
        default: () => [],
      },
      rows: {
        type: Number,
        default: 0,
      },
    },

    setup(props) {
      const focusInput = ref<QInput | null>(null)

      const requiredLabel = computed(() => props.required || props.requiredLabel)

      const fieldLabel = computed(() => (props.label ? `${props.label}${requiredLabel.value ? '*' : ''}` : null))
      const fieldClass = computed(() => ({
        'styled-input__label': true,
        required: requiredLabel.value,
      }))

      const innerRules = computed(() => {
        if (props.required) {
          return [requiredRule, ...props.rules]
        }
        return props.rules
      })

      function focus() {
        focusInput.value?.focus()
      }

      return {
        fieldLabel,
        fieldClass,
        innerRules,
        focusInput,

        focus,
      }
    },
    // render(createElement, hack) {
    // }
  })
</script>

<style lang="scss">
  .styled-input {
    &__label {
      padding-bottom: 4px;

      &.required {
        font-weight: bold;
      }
    }

    &__input {
      padding: 6px;
    }

    &__q-input {
      //padding: 4px;
      .q-field__control {
        flex: 1 0 auto;
      }

      .q-field__append {
        padding-right: 6px;
      }

      .q-field__control-container {
        > textarea {
          resize: none;
        }
      }
    }
  }
</style>

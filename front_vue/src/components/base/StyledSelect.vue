<template>
  <label class="flex column styled-select">
    <span :class="fieldClass" v-if="fieldLabel">{{fieldLabel}}</span>
    <q-select
      :value="value"
      v-bind="$attrs"
      v-on="$listeners"
      class="styled-select__input col-grow"
      color="input"
      bg-color="input"
      dense
      outlined
      bottom-slots

      :rules="innerRules"

      :options="options"
      :emit-value="emitValue"
      :map-options="mapOptions"

      :option-label="optionLabel"
      :option-value="optionValue"
      :options-dense="optionsDense"
      :option-disable="optionDisable"
    >
      <!--suppress JSUnusedLocalSymbols -->
      <slot v-for="(_, name) in $slots" :name="name" :slot="name"/>
      <!--suppress JSUnusedLocalSymbols -->
      <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
        <slot :name="name" v-bind="slotData"/>
      </template>
    </q-select>
  </label>
</template>


<script lang="ts">
  import { computed, defineComponent, PropType } from '@vue/composition-api';
  import requiredRule from 'src/utils/rules/requiredRule';

  type FunctionRule = (val: any) => boolean | string;

  export default defineComponent({
    name: 'StyledSelect',
    props: {
      label: String,
      value: [Object, String, Number],
      required: Boolean,
      requiredLabel: Boolean,

      rules: {
        type: Array as PropType<FunctionRule[]>,
        default: () => []
      },

      options: Array,
      optionValue: [Function, String],
      optionLabel: [Function, String],
      optionDisable: [Function, String],
      optionsDense: Boolean,
      mapOptions: Boolean,
      emitValue: Boolean
    },
    setup(props) {
      const requiredLabel = computed(() => props.required || props.requiredLabel)
      const fieldLabel = computed(() => props.label ? `${props.label}${requiredLabel.value ? '*' : ''}` : null)
      const fieldClass = computed(() => ({
        'styled-select__label': true,
        'required': requiredLabel.value
      }))

      const innerRules = computed(() => {
        if (props.required) {
          return [requiredRule, ...props.rules]
        }
        return props.rules
      })

      return {
        fieldLabel,
        fieldClass,
        innerRules
      }
    }
  });
</script>

<style lang="scss">
  .styled-select {
    &__label {
      padding-bottom: 4px;

      &.required {
        font-weight: bold;
      }
    }
  }
</style>

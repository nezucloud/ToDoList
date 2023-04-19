export default {
  props: ["label", "id", "modelValue", "hideLabel"],
  emits: ["update:modelValue"],
  setup(props) {
    const { label, id, hideLabel } = props;

    return {
      label,
      id,
      hideLabel,
    };
  },

  template: `
    <div class="mb-3">
        <label :for="id" class="form-label" v-if="!hideLabel">{{ label }}</label>
        <input class="form-control" :id="id" :name="id" v-bind="$attrs" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)" >

        <div class="invalid-feedback">
          <slot name="invalid" />
        </div>
    </div>
    `,
};

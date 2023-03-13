export default {
  props: ["label", "id", "modelValue"],
  emits: ["update:modelValue"],
  setup(props) {
    const { label, id } = props;

    return {
      label,
      id,
    };
  },

  template: `
    <div class="mb-3">
        <label :for="id" class="form-label">{{ label }}</label>
        <textarea class="form-control" :id="id" :name="id" rows="3" v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"></textarea>

        <div class="invalid-feedback">
          <slot name="invalid" />
        </div>
    </div>
      `,
};

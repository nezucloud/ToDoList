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
    <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" :id="id" :name="id"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        v-bind="$attrs">
        <label class="form-check-label" :for="id">
            {{ label }}
        </label>

        <div class="invalid-feedback">
          <slot name="invalid" />
        </div>
    </div>
        `,
};

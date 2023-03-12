export default {
  props: ["label", "id"],
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
        <input class="form-control" :id="id" :name="id" v-bind="$attrs">
    </div>
    `,
};

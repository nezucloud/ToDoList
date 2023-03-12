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
        <textarea class="form-control" :id="id" :name="id" rows="3" v-bind="$attrs"></textarea>
    </div>
      `,
};

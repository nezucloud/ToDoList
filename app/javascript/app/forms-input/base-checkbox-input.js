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
    <div class="form-check">
        <input class="form-check-input" type="checkbox" :id="id" :name="id">
        <label class="form-check-label" :for="id">
            {{ label }}
        </label>
    </div>
        `,
};

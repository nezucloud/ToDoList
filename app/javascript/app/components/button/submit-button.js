import BaseButton from "./base-button";

export default {
  components: {
    BaseButton,
  },
  template: `
    <BaseButton class="btn-primary" type="submit">
        <i class="ti ti-device-floppy"></i>
        Submit
    </BaseButton>
  `,
};

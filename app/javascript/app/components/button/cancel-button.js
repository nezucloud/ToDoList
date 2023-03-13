import BaseButton from "./base-button";
import "@popperjs/core";
import { Tooltip } from "bootstrap";

import { onMounted, ref } from "vue";

export default {
  setup() {
    const btnRef = ref(null);

    onMounted(() => {
      new Tooltip(btnRef.value);
    });

    function forwardRef(btn) {
      btnRef.value = btn.value;
    }

    return {
      forwardRef,
      btnRef,
    };
  },
  components: {
    BaseButton,
  },
  template: `
    <BaseButton class="btn-info" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Cancel" @forward-ref="forwardRef">
        <i class="ti ti-x"></i>
        Cancel
    </BaseButton>
  `,
};

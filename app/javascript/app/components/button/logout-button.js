import BaseButton from "./base-button";
import "@popperjs/core";
import { Tooltip } from "bootstrap";

import { onMounted, ref } from "vue";
import { USER_LOGOUT } from "../../services/users";
import BaseModal from "../modal/base-modal";

export default {
  setup() {
    const btnRef = ref(null);

    onMounted(() => {
      new Tooltip(btnRef.value);
    });

    function forwardRef(btn) {
      btnRef.value = btn.value;
    }

    function logOut() {
      USER_LOGOUT().then(() => {
        window.location.href = "/";
      });
    }

    return {
      logOut,
      forwardRef,
      btnRef,
    };
  },
  components: {
    BaseButton,
    BaseModal,
  },
  template: `
    <div>
        <BaseButton class="btn-outline-danger" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Log Out" @forward-ref="forwardRef" @click="logOut">
            <i class="ti ti-power"></i>
            Log Out
        </BaseButton>
    </div>
  `,
};

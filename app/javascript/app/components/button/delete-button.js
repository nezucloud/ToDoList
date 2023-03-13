import BaseButton from "./base-button";
import "@popperjs/core";
import { Tooltip } from "bootstrap";

import { onMounted, ref, nextTick } from "vue";
import BaseModal from "../modal/base-modal";
import CancelButton from "./cancel-button";
import { Modal } from "bootstrap";

export default {
  emits: ["onDelete"],
  setup() {
    const btnRef = ref(null);
    const openModal = ref(false);
    const modal = ref(null);

    onMounted(() => {
      new Tooltip(btnRef.value);
    });

    function forwardRef(btn) {
      btnRef.value = btn.value;
    }

    function handleOpenModalDelete() {
      openModal.value = true;
      nextTick(() => {
        modal.value = new Modal("#modalDelete");

        modal.value.show();
      });
    }

    function handleModalDismiss() {
      return (openModal.value = false);
    }

    return {
      forwardRef,
      btnRef,
      openModal,
      handleOpenModalDelete,
      handleModalDismiss,
      modal,
    };
  },
  components: {
    BaseButton,
    BaseModal,
    CancelButton,
  },
  template: `
    <BaseButton class="btn-danger" data-bs-toggle="tooltip modal" data-bs-placement="top" data-bs-title="Delete" @forward-ref="forwardRef" v-bind="$attrs"
    data-bs-target="#modalDelete" @click="handleOpenModalDelete">
        <i class="ti ti-trash"></i>
        Delete
    </BaseButton>
    <BaseModal id="modalDelete" v-if="openModal" title="Delete Data" @on-dismiss="handleModalDismiss">
        <template #default>
            Are you sure you want to delete ?
        </template>

        <template #modal-footer>
            <CancelButton data-bs-dismiss="modal" />
            <BaseButton class="btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete" @click="$emit('onDelete', $event, modal)">
                <i class="ti ti-trash"></i>
                Delete
            </BaseButton>
        </template>
    </BaseModal>
  `,
};

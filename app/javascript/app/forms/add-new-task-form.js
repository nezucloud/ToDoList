import AddButton from "../components/button/add-button";
import BaseModal from "../components/modal/base-modal";
import SubmitButton from "../components/button/submit-button";
import BaseTextfieldInput from "../forms-input/base-textfield-input";
import BaseTextareaInput from "../forms-input/base-textarea-input";
import BaseCheckboxInput from "../forms-input/base-checkbox-input";

// Dependencies
import { Modal } from "bootstrap";
import { ref, nextTick } from "vue";

export default {
  setup() {
    const openModal = ref(false);

    function openFormModal() {
      openModal.value = !openModal.value;
      nextTick(() => {
        const modal = new Modal("#modalAddTask");

        if (openModal.value) return modal.show();
      });
    }

    function onModalDismiss() {
      openModal.value = !openModal.value;
    }

    return {
      onModalDismiss,
      openModal,
      openFormModal,
    };
  },

  components: {
    AddButton,
    BaseModal,
    SubmitButton,
    BaseTextfieldInput,
    BaseTextareaInput,
    BaseCheckboxInput,
  },

  template: `
    <div>
        <AddButton @click="openFormModal" class="w-100" />
        <KeepAlive>
          <BaseModal id="modalAddTask" title="Add new task" v-if="openModal" @onDismiss="onModalDismiss">

              <template #default>
                <form action="" method="post" id="addTaskForm">
                  <div class="d-flex gap-4 align-items-end">
                    <BaseTextfieldInput id="due_date" label="Due Date" placeholder="Due Date" type="datetime-local"/>
                    <BaseCheckboxInput id="priority" label="Set as priority ?" class="mb-4"/>
                  </div>
                  <BaseTextfieldInput id="title" label="Task Title" placeholder="Title"/>
                  <BaseTextareaInput id="description" label="Description" placeholder="Description"/>
                </form>
              </template>

              <template #modal-footer>
                <SubmitButton form="addTaskForm"/>
              </template>
          </BaseModal>
        </KeepAlive>
    </div>
  `,
};

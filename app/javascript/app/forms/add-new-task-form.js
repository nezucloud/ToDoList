import AddButton from "../components/button/add-button";
import BaseModal from "../components/modal/base-modal";
import SubmitButton from "../components/button/submit-button";
import BaseTextfieldInput from "../forms-input/base-textfield-input";
import BaseTextareaInput from "../forms-input/base-textarea-input";
import BaseCheckboxInput from "../forms-input/base-checkbox-input";

// Tools
import { Modal } from "bootstrap";
import { ref, nextTick, reactive, computed } from "vue";
import { ADD_TASK } from "../services/tasks";
import { toastSuccess } from "../../lib/toast";

export default {
  setup() {
    const openModal = ref(false);
    const modal = ref(null);
    const disabledSubmit = ref(false);

    const invalid = ref({});

    // Form Data
    const formData = reactive({
      title: "",
      description: "",
      due_date: "",
      priority: false,
    });

    function openFormModal() {
      openModal.value = !openModal.value;
      nextTick(() => {
        modal.value = new Modal("#modalAddTask");

        if (openModal.value) return modal.value.show();
      });
    }

    function onModalDismiss() {
      openModal.value = !openModal.value;
    }

    const onFormSubmit = async () => {
      disabledSubmit.value = true;
      return ADD_TASK(formData)
        .then((res) => {
          invalid.value = {};
          modal.value.hide();
          return toastSuccess(res.data.message);
        })
        .catch((err) => {
          invalid.value = err.response.data.errors;
          disabledSubmit.value = false;
        });
    };

    return {
      invalid,
      onFormSubmit,
      onModalDismiss,
      openModal,
      openFormModal,
      formData,
      disabledSubmit,
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
                <form action="/task/create" method="post" id="addTaskForm" @submit.prevent="onFormSubmit">
                  <div class="d-flex gap-4 align-items-end">
                    <BaseTextfieldInput id="task[due_date]" label="Due Date" placeholder="Due Date" type="datetime-local" v-model="formData.due_date" :class="{ ['is-invalid']: Boolean(invalid.due_date) }">
                      <template #invalid v-if="invalid.due_date">
                        {{ invalid.due_date.join(', ') }}
                      </template>
                    </BaseTextfieldInput>

                    <BaseCheckboxInput id="task[priority]" label="Set as priority" true-value="yes" false-value="no" v-model="formData.priority" />
                  </div>

                  <BaseTextfieldInput id="task[title]" label="Task Title" placeholder="Title" v-model="formData.title" :class="{ ['is-invalid']: Boolean(invalid.title) }">
                    <template #invalid v-if="invalid.title">
                      {{ invalid.title.join(', ') }}
                    </template>
                  </BaseTextfieldInput>

                  <BaseTextareaInput id="task[description]" label="Description" placeholder="Description" v-model="formData.description" >
                  </BaseTextareaInput>

                </form>
              </template>

              <template #modal-footer>
                <SubmitButton form="addTaskForm" :disabled="disabledSubmit"/>
              </template>
          </BaseModal>
        </KeepAlive>
    </div>
  `,
};

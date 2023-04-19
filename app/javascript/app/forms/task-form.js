import AddButton from "../components/button/add-button";
import BaseModal from "../components/modal/base-modal";
import SubmitButton from "../components/button/submit-button";
import BaseTextfieldInput from "../forms-input/base-textfield-input";
import BaseTextareaInput from "../forms-input/base-textarea-input";
import BaseCheckboxInput from "../forms-input/base-checkbox-input";

// Tools
import { ref, reactive, onMounted } from "vue";
import { ADD_TASK, UPDATE_TASK } from "../services/tasks";
import { toastSuccess } from "../../lib/toast";
import "dayjs";

export default {
  emits: ["onModalDismiss", "afterSubmit"],
  props: ["openModal", "initialFormValue", "formOptions"],
  setup(props, context) {
    const { openModal, initialFormValue, formOptions } = props;
    const { title, description, due_date, id, status } = initialFormValue;
    const disabledSubmit = ref(false);

    const invalid = ref({});

    // Form Data
    const formData = reactive({});

    onMounted(() => {
      formData.id = id;
      formData.title = title ?? "";
      formData.description = description ?? "";
      formData.due_date = due_date
        ? dayjs(due_date).subtract(7, "hour").format("YYYY-MM-DDTHH:mm")
        : dayjs().format("YYYY-MM-DDTHH:mm");
      formData.priority = 1 ?? false;
      formData.status = status ?? "draft";
    });

    const handleAfterSubmit = () => {
      context.emit("afterSubmit");
    };

    const onFormSubmit = async () => {
      disabledSubmit.value = true;
      if (formOptions.requestMethod === "POST") {
        return ADD_TASK(formData)
          .then((res) => {
            invalid.value = {};
            handleAfterSubmit();
            return toastSuccess(res.data.message);
          })
          .catch((err) => {
            invalid.value = err?.response?.data?.errors ?? {};
            disabledSubmit.value = false;
          });
      } else {
        return UPDATE_TASK(formData)
          .then((res) => {
            invalid.value = {};
            handleAfterSubmit();
            return toastSuccess(res.data.message);
          })
          .catch((err) => {
            invalid.value = err?.response?.data?.errors ?? {};
            disabledSubmit.value = false;
          });
      }
    };

    return {
      id,
      invalid,
      onFormSubmit,
      openModal,
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
    <KeepAlive>
      <BaseModal id="modalAddTask" :title="'Form Task ' + (id ? 'Edit' : 'Add') " v-if="openModal" @onDismiss="$emit('onModalDismiss')" v-bind="$attrs">

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

              <label for="status" class="form-label">Status</label>
              <select class="form-select form-select" id="status" v-model="formData.status" name="task[status]">
                <option value="process">Process</option>
                <option value="finished">Finish</option>
                <option value="draft">Draft</option>
              </select>

            </form>
          </template>

          <template #modal-footer>
            <SubmitButton form="addTaskForm" :disabled="disabledSubmit"/>
          </template>
      </BaseModal>
    </KeepAlive>
  `,
};

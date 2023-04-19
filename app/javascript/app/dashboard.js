import {
  createApp,
  ref,
  watchEffect,
  nextTick,
  reactive,
  onMounted,
} from "vue";

import TaskForm from "./forms/task-form";
import BaseCheckboxInput from "./forms-input/base-checkbox-input";
import { DELETE_TASK, GET_TASKS, UPDATE_TASK } from "./services/tasks";
import AddButton from "./components/button/add-button";
import EditButton from "./components/button/edit-button";
import LogoutButton from "./components/button/logout-button";
import DeleteButton from "./components/button/delete-button";
import BaseTextfieldInput from "./forms-input/base-textfield-input";

import { toastSuccess } from "../lib/toast";
import "dayjs";
import { Modal } from "bootstrap";
import { USER_SHOW } from "./services/users";

createApp({
  setup() {
    // Filter
    const sortBy = ref("due_date");
    const filterBy = ref("today");
    const hideFinished = ref(true);
    const searchTitle = ref("");

    const tasks = ref([]);
    const user = ref({});

    const openModal = ref(false);
    const modal = ref(null);
    const editData = ref({});
    const formOptions = reactive({ requestMethod: "POST" });

    onMounted(() => {
      USER_SHOW().then((res) => {
        user.value = res.data.data;
      });
    });

    function openFormModal() {
      openModal.value = !openModal.value;
      nextTick(() => {
        modal.value = new Modal("#modalAddTask");
        if (openModal.value) return modal.value.show();
      });
    }

    function onFormModalDismiss() {
      openModal.value = !openModal.value;
    }

    function handleAddButtonClick() {
      editData.value = {};
      formOptions.requestMethod = "POST";
      openFormModal();
    }

    function handleEditButtonClick(params) {
      editData.value = params;
      formOptions.requestMethod = "PATCH";
      nextTick(() => {
        openFormModal();
      });
    }

    function handleAfterSubmit() {
      invalidateTasks();
      modal.value.hide();
      setTimeout(() => {
        openModal.value = !openModal.value;
      }, 250);
    }

    const optionsOrder = [
      { key: "due_date", value: "Due Date" },
      { key: "priority", value: "Priority" },
      { key: "status", value: "Status" },
    ];

    const optionsFilter = [
      { key: "today", value: "Due Today" },
      { key: "all", value: "All" },
    ];

    async function invalidateTasks() {
      return GET_TASKS(
        `sortby=${sortBy.value}&filterby=${filterBy.value}&hide_finished=${
          hideFinished.value ? true : false
        }&search_title=${searchTitle.value}`
      ).then((response) => {
        tasks.value = response.data.data;
      });
    }

    watchEffect(async () => {
      await invalidateTasks();
    });

    async function handleMarkDone(event) {
      const value = event.target.value;
      const checked = event.target.checked;
      return await UPDATE_TASK({
        id: value,
        status: checked ? "finished" : "process",
      }).then((res) => {
        invalidateTasks();
        toastSuccess(res.data.message);
      });
    }

    async function handleDeleteData(task, event, modal) {
      event.target.disabled = true;
      return DELETE_TASK(task.id).then((res) => {
        invalidateTasks();
        toastSuccess(res.data.message);
        modal.hide();
      });
    }

    return {
      user,
      optionsFilter,
      optionsOrder,
      tasks,
      sortBy,
      filterBy,
      dayjs,
      hideFinished,
      handleMarkDone,
      onFormModalDismiss,
      handleAddButtonClick,
      handleEditButtonClick,
      handleAfterSubmit,
      handleDeleteData,
      formOptions,
      editData,
      openModal,
      modal,
      searchTitle,
    };
  },
  components: {
    TaskForm,
    BaseCheckboxInput,
    AddButton,
    EditButton,
    LogoutButton,
    DeleteButton,
    BaseTextfieldInput,
  },
  template: `
  <div class="container-fluid p-3">
    <div class="row">

      <div class="col-12 mb-2">
        <div class="d-flex justify-content-between bg-light p-1 rounded-1">
          <h2 class="ms-2">Task List <i>({{ user.email }})</i></h2>
          <div class="align-self-center d-flex align-items-center gap-3">
            <a href="/auth/register/edit" class="btn rounded-5">Edit Profile</a>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div class="col-12">
        
        <div class="card">
          <div class="card-body">
            <div class="row mb-3">

              <div class="col-sm-2 mb-2">
                <AddButton @click="handleAddButtonClick" class="w-100" />
                <TaskForm :open-modal="openModal" v-if="openModal" @on-modal-dismiss="onFormModalDismiss" :initialFormValue="editData" 
                @after-submit="handleAfterSubmit" :form-options="formOptions"/>
              </div> 

              <div class="col-sm-10">
                <div>
                  <div class="row">

                    <div class="col-md-6 col-lg-3 row">
                      <label for="order_by" class="col-sm-4 col-form-label text-center">Sort By</label>
                      <div class="col-sm-8 pt-1" >
                        <select class="form-select form-select-sm" id="order_by" v-model="sortBy">
                          <option v-for="option in optionsOrder" :value="option.key"> {{ option.value }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-3 row">
                      <label for="filter_by" class="col-sm-4 col-form-label text-center">Filter By</label>
                      <div class="col-sm-8 pt-1" >
                        <select class="form-select form-select-sm" id="filter_by" v-model="filterBy">
                          <option v-for="option in optionsFilter" :value="option.key"> {{ option.value }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-3 pt-2">
                      <BaseCheckboxInput label="Hide Finished" id="hide_finished" v-model="hideFinished"/>
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <BaseTextfieldInput id="search_title" class="form-control-sm" placeholder="Searh By Title" v-model.lazy="searchTitle" :hide-label="true"/>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Done</th>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks">
                  <th scope="row">
                    <input class="form-check-input" type="checkbox" :value="task.id"  :checked="task.status == 'finished'" @change="handleMarkDone"/>
                  </th>
                  <td>{{ task.title }}</td>
                  <td>{{ task.description }}</td>
                  <td>{{ dayjs(task.due_date).subtract(7, 'hour').format('MMMM D, YYYY h:mm A') }}</td>
                  <td>{{ task.status }}</td>
                  <td>
                    <EditButton @click="handleEditButtonClick(task)"/>
                    <DeleteButton class="ms-2" @on-delete="(event, modal) => handleDeleteData(task, event, modal)"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
  `,
}).mount("#app");

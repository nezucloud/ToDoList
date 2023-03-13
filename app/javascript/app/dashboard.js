import { createApp, ref, watchEffect } from "vue";

import AddNewTaskForm from "./forms/add-new-task-form";
import BaseCheckboxInput from "./forms-input/base-checkbox-input";
import { GET_TASKS, UPDATE_TASK } from "./services/tasks";

import { toastSuccess } from "../lib/toast";
import "dayjs";

createApp({
  setup() {
    const sortBy = ref("due_date");
    const tasks = ref([]);

    const options = [
      { key: "due_date", value: "Due Date" },
      { key: "status", value: "Status" },
      { key: "priority", value: "Priority" },
    ];

    async function getTasks() {
      return GET_TASKS(`sortby=${sortBy.value}`).then((response) => {
        tasks.value = response.data.data;
      });
    }

    watchEffect(async () => {
      await getTasks();
    });

    async function handleMarkDone(event) {
      const value = event.target.value;
      const checked = event.target.checked;
      return await UPDATE_TASK({
        id: value,
        status: checked ? "finished" : "process",
      }).then((res) => {
        toastSuccess(res.data.message);
      });
    }

    return { options, tasks, sortBy, dayjs, handleMarkDone };
  },
  components: { AddNewTaskForm, BaseCheckboxInput },
  template: `
  <div class="container-fluid p-3">
    <div class="row">

      <div class="col-12">
        <h2 class="text-center bg-light rounded-1 py-1">TASK LIST</h2>
      </div>

      <div class="col-sm-2 mb-2">
        <AddNewTaskForm />
      </div> 

      <div class="col-sm-10">
        <div class="bg-light rounded-1">
          <div class="row">

            <div class="col-md-6 col-lg-4 row">
              <label for="filter_by" class="col-sm-4 col-form-label text-center">Sort By</label>
              <div class="col-sm-8 pt-1" >
                <select class="form-select form-select-sm" id="filter_by" value="due_date" v-model="sortBy">
                 <option v-for="option in options" :value="option.key"> {{ option.value }}</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Done</th>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col">Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks">
                  <th scope="row">
                    <input class="form-check-input" type="checkbox" :value="task.id"  :checked="task.status == 'finished'" @change="handleMarkDone"/>
                  </th>
                  <td>{{ task.title }}</td>
                  <td>{{ task.description }}</td>
                  <td>{{ dayjs(task.due_date) }}</td>
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

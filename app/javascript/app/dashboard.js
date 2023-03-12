import { createApp, ref, nextTick, onMounted, onUnmounted } from "vue";

import AddNewTaskForm from "./forms/add-new-task-form";

createApp({
  setup() {
    const screenWidth = ref(window.innerWidth);

    const changeScreenWidth = () => {
      screenWidth.value = window.innerWidth;
    };

    // Add event listeners
    onMounted(() => {
      window.addEventListener("resize", () => {
        changeScreenWidth();
      });
    });

    // Remove the event listener
    onUnmounted(() => {
      window.removeEventListener("resize", () => {
        changeScreenWidth();
      });
    });

    return {
      screenWidth,
    };
  },
  components: { AddNewTaskForm },
  template: `
  <div class="container-md p-3">
    <div class="row">

      <div v-if="screenWidth > 576" class="col-sm-3">
        <AddNewTaskForm />
      </div> 

    </div>
  </div>
  `,
}).mount("#app");

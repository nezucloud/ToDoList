import { createApp } from "vue";

createApp({
  setup() {
    return {};
  },
  components: {},
  template: `
  <div class="d-flex justify-content-center align-items-center flex-column vh-100 gap-5">
    <h1 class="text-white fs-1">Organize your
    work and life, Easily.</h1>
    <div class="d-flex gap-3">
    <a href="/auth/login" class="btn btn-warning btn-lg ">Log in </a>
    <a href="/auth/register/sign_up" class="btn btn-success btn-lg text-white">Register</a>
    </div>
  </div>
  `,
}).mount("#app");

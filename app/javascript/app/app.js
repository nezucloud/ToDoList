import { createApp } from "vue";
import NavBar from "./components/nav-bar";

createApp({
  setup() {
    return {};
  },
  components: { NavBar },
  template: `
  <div class="bg-light">
    <a href="/auth/login">Log In </a><br>
    <a href="/auth/register/sign_up">Register</a>
  </div>
  `,
}).mount("#app");

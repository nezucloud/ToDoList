import { ref, onMounted } from "vue";

export default {
  emits: ["forwardRef"],
  setup(_, context) {
    const btnRef = ref(null);

    onMounted(() => {
      context.emit("forwardRef", btnRef);
    });

    return {
      btnRef,
    };
  },

  template: `
    <button class="btn rounded-5" ref="btnRef">
        <slot />
    </button>`,
};

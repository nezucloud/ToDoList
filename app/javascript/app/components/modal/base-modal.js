import { onMounted, onBeforeUnmount } from "vue";

export default {
  emits: ["onDismiss"],
  props: ["id", "title"],

  setup(props, context) {
    const { id, title } = props;

    onMounted(() => {
      document.getElementById(id).addEventListener("hidden.bs.modal", () => {
        context.emit("onDismiss");
      });
    });

    onBeforeUnmount(() => {
      document.getElementById(id).removeEventListener("hidden.bs.modal", () => {
        context.emit("onDismiss");
      });
    });

    return {
      id,
      title,
    };
  },

  template: `
    <div class="modal fade rounded-5" :id="id" tabindex="-1" :aria-labelledby="id + 'Label'" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" :id="id + 'Label' ">{{ title }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <slot />
            </div>
            <div class="modal-footer">
                <slot name="modal-footer" />
            </div>
            </div>
        </div>
    </div>
    `,
};

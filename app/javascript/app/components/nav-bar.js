import { reactive, ref, nextTick } from "vue";

export default {
  props: ["title"],

  setup(props) {
    const { title } = props;

    return {
      title,
    };
  },

  template: `
  <h1 :class="$attrs.class">Hell {{ title }}</h1>
  <p>Indah itu tak selalu ada </p>
  `,
};

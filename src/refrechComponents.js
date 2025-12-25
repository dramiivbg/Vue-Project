import { ref } from 'vue';

export const componentKey = ref(0);

export const forceUpdate = () => {
  componentKey.value += 1;
};
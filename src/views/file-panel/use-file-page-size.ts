import { Ref } from 'vue';

export function useFilePageSize(listBox: Ref<HTMLElement | undefined>) {
  // const listBox = ref<HTMLElement>();

  function getSize() {
    let itemNumber = 6;
    let itemHeight = 2;
    if (listBox.value) {
      const width = listBox.value?.scrollWidth;
      const height = listBox.value?.scrollHeight;
      itemNumber = Number((width / 196).toFixed(0));
      itemHeight = Number(((height - 60) / 196).toFixed(0));
    }
    return itemNumber * itemHeight;
  }

  return {
    getSize
  };
}

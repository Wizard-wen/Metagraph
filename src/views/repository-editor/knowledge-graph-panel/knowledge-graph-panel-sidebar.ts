import { ref } from 'vue';

export const currentBar = ref<string>('panel');

export function setCurrentBar(type: string): void {
  currentBar.value = type;
}


export function getCurrentNodeEdges() {

}

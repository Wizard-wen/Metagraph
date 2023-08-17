<template>
  <div class="items">
    <button
      class="item"
      :class="{ 'is-selected': index === selectedIndex }"
      v-for="(item, index) in items"
      :key="index"
      @keydown="onKeyDown($event)"
      @click="selectItem(index)"
    >
      {{ item.entity.name }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { EntityCompletelyListItemType } from '@metagraph/constant';
import {
  watch, ref, PropType, defineProps, defineExpose
} from 'vue';

const props = defineProps({
  items: {
    type: Array as PropType<EntityCompletelyListItemType[]>,
    required: true,
  },
  command: {
    type: Function,
    required: true,
  },
});

const selectedIndex = ref(0);
watch(props.items, () => {
  selectedIndex.value = 0;
});

function upHandler() {
  selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length;
}

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
}

function selectItem(index: any) {
  const item = props.items[index];
  if (item) {
    props.command({ id: item.entity.id, name: item.entity.name });
  }
}

function enterHandler() {
  selectItem(selectedIndex.value);
}

function onKeyDown({ event }: any) {
  if (event.key === 'ArrowUp') {
    upHandler();
    return true;
  }
  if (event.key === 'ArrowDown') {
    downHandler();
    return true;
  }
  if (event.key === 'Enter') {
    enterHandler();
    return true;
  }
  return false;
}

defineExpose({
  onKeyDown
});
</script>

<style lang="scss" scoped>
@import "../../../style/common.scss";
.items {
  min-width: 120px;
  position: relative;
  border-radius: 0.25rem;
  background: white;
  color: rgba(black, 0.8);
  overflow: hidden;
  font-size: 0.9rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1),
  0px 10px 20px rgba(0, 0, 0, 0.1);
}

.item {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 0.2rem 0.5rem;

  &.is-selected,
  &:hover {
    color: $themeColor;
    background: rgba($themeColor, 0.1);
  }
}
</style>

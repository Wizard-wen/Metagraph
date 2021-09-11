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

<script lang="ts">
import {
  defineComponent, watch, ref, toRefs
} from 'vue';

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },
  },
  setup(props: any) {
    const { items, command } = toRefs(props);
    console.log(items, command);
    const selectedIndex = ref(0);
    watch(items, () => {
      selectedIndex.value = 0;
    });

    function upHandler() {
      selectedIndex.value = ((selectedIndex.value + items.value.length) - 1) % items.value.length;
    }

    function downHandler() {
      selectedIndex.value = (selectedIndex.value + 1) % items.value.length;
    }

    function selectItem(index: any) {
      const item = items.value[index];
      console.log(item, index);
      if (item) {
        command.value({ id: item.entity.id, name: item.entity.name });
      }
    }

    function enterHandler() {
      selectItem(selectedIndex.value);
    }

    function onKeyDown({ event }: any) {
      console.log(event);
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

    return {
      onKeyDown,
      downHandler,
      selectItem,
      selectedIndex
    };
  }
});
</script>

<style lang="scss" scoped>
.items {
  position: relative;
  border-radius: 0.25rem;
  background: white;
  color: rgba(black, 0.8);
  overflow: hidden;
  font-size: 0.9rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1),
  0px 10px 20px rgba(0, 0, 0, 0.1),;
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
    color: #A975FF;
    background: rgba(#A975FF, 0.1);
  }
}
</style>

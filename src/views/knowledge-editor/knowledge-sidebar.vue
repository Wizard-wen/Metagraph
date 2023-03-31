<template>
  <div class="toolbar">
    <div class="tabs">
      <div
        class="tab"
        :class="{ 'active': index === toolbarState.index }"
        v-for="(tab, index) in elementList"
        :key="index"
        @click="setToolbarState(tab, index)">{{ tab.label }}
      </div>
    </div>
    <div class="content">
      <slot name="content" :item="toolbarState"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, reactive
} from 'vue';

export default defineComponent({
  name: 'knowledge-sidebar',
  props: {
    elementList: {
      type: Array as PropType<{ label: string; value: number }[]>
    }
  },
  setup() {
    const toolbarState = reactive({
      label: '',
      value: '',
      index: 0
    });
    const setToolbarState = (tab: { label: string, value: string }, index: number) => {
      toolbarState.label = tab.label;
      toolbarState.value = tab.value;
      toolbarState.index = index;
    };
    return {
      toolbarState,
      setToolbarState
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../style/common';

.toolbar {
  border-left: solid 1px $borderColor;
  background-color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);

  .tabs {
    height: 32px;
    font-size: 12px;
    flex-shrink: 0;
    display: flex;

    .tab {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $lightGray;
      border-bottom: 1px solid $borderColor;
      cursor: pointer;
      font-size: 14px;

      &.active {
        background-color: #fff;
        border-bottom-color: #fff;
      }

      & + .tab {
        border-left: 1px solid $borderColor;
      }
    }
  }

  .content {
    font-size: 13px;
    height: calc(100% - 32px);
    padding-top: 15px;
  }
}
</style>

<template>
  <div class="tabs">
    <div
      class="tab"
      :class="{ 'active': tab.value === currentKey }"
      v-for="tab in elementShowTabs"
      :key="tab.value"
      @click="setToolbarState(tab.value)"
    >{{ tab.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, PropType } from 'vue';

const emit = defineEmits(['selectedChange']);
const props = defineProps({
  isEditable: {
    type: Boolean,
    default: true
  },
  currentKey: {
    type: String,
    default: ''
  },
  elementTabs: {
    type: Array as PropType<{
      value: string;
      label: string;
      isAuth: boolean
    }[]>,
    default() {
      return [];
    }
  }
});

function setToolbarState(value: string) {
  emit('selectedChange', value);
}

const elementShowTabs = computed(() => {
  if (props.isEditable) {
    return props.elementTabs;
  }
  return props.elementTabs.filter((item) => !item.isAuth);
});
</script>

<style scoped lang="scss">
@import '../style/common';
.tabs {
  height: 40px;
  font-size: 12px;
  flex-shrink: 0;
  display: flex;
  padding-left: 16px;
  border-bottom: 1px solid $borderColor;

  .tab {
    display: flex;
    justify-content: center;
    align-items: center;
    //width: 56px;
    cursor: pointer;
    padding-right: 16px;

    &.active {
      color: #000;
      font-weight: bold;
    }
  }
}
</style>

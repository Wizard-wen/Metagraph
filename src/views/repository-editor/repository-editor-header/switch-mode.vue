<template>
  <div class="mode-bar">
    <div
      v-for="(item, index) in viewBarList"
      :key="index"
      @click="handleViewChange(item)"
      :class="[
        'bar-item',
        item.isActive ? 'active-bar' : '',
        item.key === 'section' ? 'bar-left' : 'bar-right'
      ]"
    >{{ item.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, PropType, ref } from 'vue';

const emit = defineEmits(['viewChange']);
const props = defineProps({
  viewStatus: {
    type: String as PropType<'section' | 'graph'>,
    required: true
  }
});
const barList = ref([
  { name: '文档模式', key: 'section' },
  { name: '图谱模式', key: 'graph' }
]);

const viewBarList = computed(() => barList.value.map((item) => ({
  ...item,
  isActive: item.key === props.viewStatus
})));

function handleViewChange(item: {
  name: string;
  key: string;
}) {
  if (item.key !== props.viewStatus) {
    emit('viewChange', item.key);
  }
}
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.mode-bar {
  height: 32px;
  width: 220px;
  display: flex;
  border: 1px solid $hoverDeepBackColor;
  border-radius: 16px;
  background: #FFF;
  cursor: pointer;

  .bar-item {
    width: 50%;
    line-height: 30px;
  }

  .bar-left {
    border-bottom-left-radius: 16px;
    border-top-left-radius: 16px;
  }

  .bar-right {
    border-bottom-right-radius: 16px;
    border-top-right-radius: 16px;
  }

  .active-bar {
    background: $hoverDeepBackColor;

  }
}
</style>

<template>
  <div class="check-box">
    <div
      @click="handleClick(item)"
      v-for="(item, index) in viewOptionList"
      :key="index"
      class="item">
      <template v-if="item.isIcon">
        <component :is="item.name"></component>
      </template>
      <template v-else>{{ item.name }}</template>
    </div>
    <div @click="$event.stopPropagation()" class="checked"
         :class="isLeft ? 'left' : 'right'"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, PropType, ref, watchEffect } from 'vue';

const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  type: {
    type: String as PropType<'switch' | 'checkbox'>,
    default: 'switch'
  },
  modelValue: {
    type: String,
    default: ''
  },
  optionList: {
    type: Array as PropType<{ key: string | boolean; name: string; isIcon?: boolean }[]>,
    default() {
      return [];
    }
  }
});

const viewOptionList = computed<{
  key: string | boolean;
  name: string;
  isIcon?: boolean
}[]>(() => {
  if (props.type === 'switch') {
    return [{
      key: true, name: 'ON'
    }, {
      key: false, name: 'OFF'
    }];
  }
  return props.optionList;
});
const isLeft = ref(false);

watchEffect(() => {
  const index = viewOptionList.value.findIndex((item) => item.key === props.modelValue);
  console.log(index);
  isLeft.value = index === 0;
});


function handleClick(item: {
  key: string | boolean; name: string; isIcon?: boolean
}) {
  console.log(item);
  if (item.key === props.modelValue) {
    return;
  }
  emit('update:modelValue', item.key);
  // isLeft.value = !isLeft.value;
}
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.check-box {
  height: 28px;
  border-radius: 6px;
  padding: 2px;
  background: #f7f7f9;
  width: 86px;
  position: relative;
  cursor: pointer;
  display: flex;

  .item {
    width: 41px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    z-index: 2;
  }

  .checked {
    cursor: default;
    position: absolute;
    width: 41px;
    height: 24px;
    background: #FFF;
    box-shadow: 0 2px 8px #19191a1f, 0 0 1px #19191a14;
    transition: left .5s;
    border-radius: 5px;
  }

  .left {
    left: 2px;
  }

  .right {
    left: 50%;
  }
}
</style>

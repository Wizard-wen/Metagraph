<template>
  <div class="slider">
    <div class="slider-box" @click="handleClickPosition($event)">
      <div class="slider-line" ref="sliderLine">
        <div
          ref="sliderLineHighlight"
          class="slider-highlight"
          :style="sliderHighlightStyle"></div>
        <div
          ref="slideBtn"
          class="slider-btn"
          :style="{
        left: left + '%'
      }"
          @mousedown="handleMouseDown($event)"></div>
      </div>
    </div>

    <div class="value">
      <input class="input-style"
             @blur="handleBlur"
             @keydown.up="changeValue($event, 'up')"
             @keydown.down="changeValue($event, 'down')"
             @keyup.enter="handleSave"
             v-model="newValue">
      <div class="unit">{{ unit }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, onMounted, onUnmounted, ref, watchEffect } from 'vue';

const slideBtn = ref<HTMLElement>();
const sliderLine = ref<HTMLElement>();
const sliderLineHighlight = ref<HTMLElement>();
const inputElement = ref<HTMLElement>();
const couldMove = ref(false);

const emit = defineEmits(['update']);

const viewStatus = ref<'view' | 'edit'>('view');
const newValue = ref(0);
const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: ''
  }
});

watchEffect(() => {
  newValue.value = props.value;
});

const left = computed(() => ((props.value / 100) * 100).toFixed(0));
const sliderHighlightStyle = computed(() => {
  return {
    width: `calc(${((props.value / 100) * 100).toFixed(0)}% + 3px)`
  };
});

const startMouseX = ref(0);
const startMouseY = ref(0);
const startWidth = ref(0);

function handleBlur() {
  viewStatus.value = 'view';
}

function handleSave() {
  if (newValue.value < 0) {
    emit('update', 0);
  } else if (newValue.value > 100) {
    emit('update', 100);
  } else {
    emit('update', Number(newValue.value));
  }
  viewStatus.value = 'view';
}

function handleMouseDown($event: MouseEvent) {
  $event.stopPropagation();
  startMouseX.value = $event.clientX;
  startMouseY.value = $event.clientY;
  startWidth.value = sliderLineHighlight.value?.offsetWidth ?? 0;
  couldMove.value = true;
}

function handleMouseUp($event: MouseEvent): boolean | undefined {
  if (!couldMove.value) return false;
  couldMove.value = false;
  return false;
}

function handleMouseMove($event: MouseEvent): boolean | undefined {
  if (!couldMove.value) return false;
  const lineWidth = (sliderLine.value?.offsetWidth ?? 0) + 5;
  // 获取拖拽移动的距离
  const eventX = $event.clientX;
  const moveX = eventX - startMouseX.value;

  const offsetWidth = Number(((moveX / lineWidth) * 100).toFixed(0));

  const startValue = Number(((startWidth.value / lineWidth) * 100).toFixed(0));
  console.log(offsetWidth, startValue);
  if ((offsetWidth + startValue) > 100) {
    emit('update', 100);
  } else if ((offsetWidth + startValue) < 0) {
    emit('update', 0);
  } else {
    emit('update', offsetWidth + startValue);
  }
  return false;
}

function handleClickPosition($event: MouseEvent) {
  const leftWidth = $event.clientX - (sliderLine.value?.getBoundingClientRect()?.x ?? 0);
  const lineWidth = (sliderLine.value?.offsetWidth ?? 0) + 5;
  const left = Number(((leftWidth / lineWidth) * 100).toFixed(0));
  if (left < 0) {
    emit('update', 0);
  } else if (left > 100) {
    emit('update', 100);
  } else {
    emit('update', left);
  }
}

function changeValue($event: KeyboardEvent, type: 'up' | 'down') {
  $event.preventDefault();
  const newValue = type === 'up' ? (props.value + 1) : (props.value - 1);
  if (newValue < 0) {
    emit('update', 0);
  } else if (newValue > 100) {
    emit('update', 100);
  } else {
    emit('update', newValue);
  }
}

onMounted(() => {
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousemove', handleMouseMove);
});
onUnmounted(() => {
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.slider {
  height: 32px;
  width: 100%;
  display: flex;
  gap: 5px;
  align-items: center;

  .slider-box {
    flex: 1;
    width: 100%;
    height: 15px;
    display: flex;
    align-items: center;
  }

  .slider-line {
    flex: 1;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    background: $hoverBackColor;
    position: relative;

    .slider-highlight {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: $themeColor;
    }

    .slider-btn {
      position: absolute;
      height: 10px;
      width: 10px;
      border-radius: 5px;
      top: -4px;
      background: $themeColor;
      user-select: none;
    }
  }

  .value {
    display: flex;
    box-sizing: border-box;
    margin-left: 15px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
    width: 48px;
    border-radius: 4px;
    background: #f7f7f9;
    align-items: center;
    cursor: pointer;
    position: relative;

    &:hover {
      background: $hoverBackColor;
    }

    .unit {
      position: absolute;
      right: 4px;
      top: 0;
      width: 16px;
      height: 100%;
      line-height: 32px;
      text-align: center;
      color: #8b8c8f;
    }

    .input-style {
      background: transparent;
      outline: none;
      border: none;
      display: block;
      width: 100%;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      text-align: center;
      padding: 0 21px 0 5px;
    }

  }
}
</style>

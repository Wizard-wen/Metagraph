<template>
  <button
    v-if="!isIcon"
    :disabled="isDisabled"
    :style="fontStyle"
    :class="['meta-normal-button', hasBorder? 'button-border-style': 'button-none-border-style' ]">
    <LoadingOutlined class="icon-style" v-if="isLoading"/>
    <slot name="icon" v-else></slot>
    {{ title }}
  </button>
  <button
    v-else
    :style="fontStyle"
    :disabled="isDisabled"
    :class="['meta-normal-button', hasBorder? 'button-border-style': 'button-none-border-style' ]">
    <slot name="icon"></slot>
  </button>
</template>
<script lang="ts" setup>
import { computed, defineProps, PropType } from 'vue';
import { LoadingOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isIcon: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hasBorder: {
    type: Boolean,
    default: true
  },
  fontSize: {
    type: Number,
    default: 12
  },
  background: {
    type: String,
    default: 'transparent'
  },
  // middle small large
  size: {
    type: String as PropType<'small' | 'middle' | 'large'>,
    default: 'middle'
  }
});
const isDisabled = computed(() => props.disabled || props.isLoading);
const fontStyle = computed(() => {
  if (props.size === 'large') {
    return {
      height: '36px',
      'line-height': props.hasBorder ? '28px' : '30px',
      'font-size': '16px'
    };
  }
  if (props.size === 'small') {
    return {
      height: '28px',
      'line-height': props.hasBorder ? '20px' : '22px',
      'font-size': '12px'
    };
  }
  return {
    height: '32px',
    'line-height': props.hasBorder ? '24px' : '26px',
    'font-size': '14px'
  };
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";
// 按钮公共样式

.button-border-style {
  border: 1px solid $hoverDeepBackColor;
}

.button-none-border-style {
  border: none;
}

.meta-normal-button {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  position: relative;

  //height: 32px;
  appearance: none;
  background-color: #fff;

  border-radius: 6px;
  //box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0,
  //rgba(255, 255, 255, 0.25) 0 1px 0 inset;

  color: $titleFontColor;

  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
  sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  //font-size: 14px;
  //line-height: 1.5;
  list-style: none;
  padding: 3px 10px;

  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  cursor: pointer;

  white-space: nowrap;
  word-wrap: break-word;

  .icon-style {
    font-size: 14px;
  }

  &:hover {
    background-color: $hoverBackColor;
    text-decoration: none;
    transition-duration: 0.1s;
  }

  &:disabled {
    background-color: #fafbfc;
    border-color: rgba(27, 31, 35, 0.15);
    color: #959da5;
    cursor: default;
  }

  &:active {
    background-color: #edeff2;
    box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
    transition: none 0s;
  }

  &:focus {
    outline: 1px transparent;
  }

  &:before {
    display: none;
  }

  &::-webkit-details-marker {
    display: none;
  }
}
</style>

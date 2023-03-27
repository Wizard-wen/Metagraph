<template>
  <button :disabled="isDisabled" class="meta-normal-button">
    <LoadingOutlined class="icon-style" v-if="isLoading"/>
    <slot name="icon" v-else></slot>
    {{ title }}
  </button>
</template>
<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { LoadingOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});
const isDisabled = computed(() => props.disabled || props.isLoading);
</script>

<style scoped lang="scss">
@import "../style/common.scss";
// 按钮公共样式
.meta-normal-button {
  height: 32px;
  appearance: none;
  background-color: #fff;
  border: 1px solid $hoverDeepBackColor;
  border-radius: 6px;
  //box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0,
  //rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: $titleFontColor;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
  sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 14px;
  line-height: 1.5;
  list-style: none;
  padding: 3px 10px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
  .icon-style {
    font-size: 14px;
  }

  &:hover {
    background-color: #f3f4f6;
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

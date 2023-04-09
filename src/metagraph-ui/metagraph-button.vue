<template>

  <button
    v-if="isIcon"
    :style="fontStyle"
    :disabled="isDisabled"
    :class="[
      'public-button',
      'normal-style',
      typeClassName,
      hasBorder? 'button-border-style': 'button-none-border-style' ]">
    <slot name="icon"></slot>
  </button>
  <button
    v-else
    :disabled="isDisabled"
    :style="fontStyle"
    :class="[
      'public-button',
      'test-style',
      'normal-style',
      typeClassName,
      hasBorder? 'button-border-style': 'button-none-border-style' ]">
    <LoadingOutlined class="icon-style" v-if="isLoading"/>
    <template v-else>
      <span class="icon-style" v-if="iconSlot">
      <slot name="icon"></slot>
    </span>
    </template>

    {{ title }}
  </button>
</template>
<script lang="ts" setup>
import { computed, defineProps, PropType, useSlots } from 'vue';
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
  type: {
    type: String as PropType<'normal' | 'primary'>,
    default: 'normal'
  },
  // middle small large
  size: {
    type: String as PropType<'small' | 'middle' | 'large'>,
    default: 'middle'
  }
});
const iconSlot = useSlots().icon;

const isDisabled = computed(() => props.disabled || props.isLoading);
const typeClassName = computed(() => {
  if (props.type === 'primary') {
    return 'primary-style';
  }
  return 'normal-style';
});
const fontStyle = computed(() => {
  let styleObject: {
    heightSize: number,
    widthSize?: number,
    lineHeightSize: number,
    fontSize: number;
  } = {
    heightSize: 32,
    lineHeightSize: props.hasBorder ? 24 : 26,
    fontSize: 14
  };
  if (props.size === 'large') {
    styleObject = {
      heightSize: 36,
      lineHeightSize: props.hasBorder ? 28 : 30,
      fontSize: 16
    };
  }
  if (props.size === 'small') {
    styleObject = {
      heightSize: 28,
      lineHeightSize: props.hasBorder ? 20 : 22,
      fontSize: 12
    };
  }

  const finalSize = {
    height: `${ styleObject.heightSize }px`,
    'font-size': `${ styleObject.fontSize }px`,
    'line-height': `${ styleObject.lineHeightSize }px`
  };
  if (props.isIcon) {
    return {
      ...finalSize,
      width: `${ styleObject.heightSize }px`
    };
  }
  return finalSize;
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

.public-button {
  box-sizing: border-box;
  //display: inline-block;
  //vertical-align: middle;
  //position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  appearance: none;
  border-radius: 6px;

  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
  sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

  list-style: none;
  //padding: 3px 10px;

  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  cursor: pointer;

  white-space: nowrap;
  word-wrap: break-word;
}

.icon-style {
  //font-size: 14px;
  margin-right: 4px;
}

.text-style {
  padding: 0 10px;
}

.normal-style {
  padding: 0 10px;

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

.normal-style {
  background-color: #fff;
  color: $titleFontColor;

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
}

.primary-style {
  background: $themeColor;
  color: #FFFFFF;

  &:hover {
    background-color: $themeHoverColor;
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
}
</style>

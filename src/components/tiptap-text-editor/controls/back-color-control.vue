<template>
  <a-dropdown
    :overlayClassName="'dropdown-overlay'"
    :visible="visible">
    <div class="operation-icon" @click="editor.chain().focus()">
      <operation-tooltip :desc="''">
        <div class="selector-box" @click="visible = true">
          <div class="icon">
            <BgColorIcon
              class="icon-svg"
              :class="{ 'is-active': editor.isActive('bold') }"/>
          </div>
          <CaretDownOutlined class="down-arrow-style" />
        </div>
      </operation-tooltip>
    </div>
    <template #overlay>
      <div class="picker-board">
        <color-picker v-model="currentColor"></color-picker>
        <div class="close">
          <m-button @click="visible = false" :title="'关闭'"></m-button>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { Dropdown as ADropdown } from 'ant-design-vue';
import { CaretDownOutlined } from '@ant-design/icons-vue';
import { defineProps, PropType, ref, watch } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { BgColorIcon } from '@/components/icons';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';
import { MButton } from '@/metagraph-ui';
import ColorPicker from '@/components/color-picker/index.vue';

const visible = ref(false);
const alignWay = ref('left');

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});

// rgb转hex色码
function hex(data: string | number) {
  const rgbtransfer16 = Number(data).toString(16).toUpperCase();
  if (rgbtransfer16.length < 2) {
    return `0${rgbtransfer16}`;
  }
  return rgbtransfer16;
}

const currentColor = ref();

watch(currentColor, (value) => {
  props.editor.chain().focus().setColor(value).run();
});

</script>

<style lang="scss" scoped>
@import "../../../style/common.scss";
@import "../../../style/tiptap.common.scss";

.picker-board {
  padding: 10px;
  background: #FFF;
  border: 1px solid #eff0f0;

  .close {
    display: flex;
    height: 36px;
    align-items: center;
    justify-content: flex-end;
  }
}

.disabled-style {
  opacity: .2;
  cursor: not-allowed !important;
}

/* 提示框 */
.ant-tooltip-inner {
  background-color: red;
}

/* 小箭头 */
.ant-tooltip-arrow::before {

}

.selector-box {
  display: flex;
  align-items: center;
  padding-right: 6px;
  //gap: 10px;
  cursor: pointer;
  border-radius: 6px;
  margin-left: 8px;

  &:hover {
    background: $hoverBackColor;
  }

  .text {
    font-size: 14px;
  }
}
</style>

<style lang="scss">
.custom-tool-tip {
  border-radius: 6px;

  .ant-tooltip-arrow {
    display: none !important;
  }

  .ant-tooltip-inner {
    height: 20px;
    width: max-content;
    line-height: 20px;
    border-radius: 6px !important;
    font-size: 12px;
  }

  &::v-deep(.ant-tooltip-arrow) {
    display: none !important;
  }

  &::v-deep(.ant-tooltip-inner) {
    border-radius: 6px !important;
  }
}

.dropdown-overlay {
  z-index: 1065 !important;
}
</style>

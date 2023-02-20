<template>
  <a-dropdown
    :trigger="['click']"
    :overlayClassName="'dropdown-overlay'"
    v-model:visible="visible">
    <div class="operation-icon" @click="editor.chain().focus()">
      <operation-tooltip :desc="''">
        <div class="selector-box">
          <div class="icon">
            <BgColorIcon
              class="icon-svg"
              :class="{ 'is-active': editor.isActive('bold') }"/>
          </div>
          <CaretDownOutlined class="down-arrow-style"/>
        </div>
      </operation-tooltip>
    </div>
    <template #overlay>
      <color-picker v-model="currentColor"></color-picker>
      <div class="list">

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

const currentSize = ref();
const currentColor = ref();

watch(currentColor, (value) => {
  console.log(value);
});
const handleAlignWayChange = (value: string) => {
  alignWay.value = value;
  visible.value = false;
};

</script>

<style lang="scss" scoped>
@import "../../../style/common.scss";
@import "../../../style/tiptap.common.scss";

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

.list {
  display: flex;
  //width: 100px;
  padding: 5px;
  border: 1px solid $borderColor;
  border-radius: $borderRadius;
  background: #fff;
  cursor: pointer;
}

.list-item {
  height: 30px;
  width: 30px;
  padding: 0 5px;
  border-radius: 4px;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  position: relative;

  .check-icon {
    font-size: 14px;
    position: absolute;
    left: 14px;
    top: 8px;
  }

  &:hover {
    background: $hoverBackColor;
  }
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

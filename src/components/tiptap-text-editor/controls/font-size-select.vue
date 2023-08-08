<template>
  <a-dropdown
    :trigger="['click']"
    :overlayClassName="'dropdown-overlay'"
    v-model:visible="visible"
    :disabled="!isParagraph">
    <a-tooltip
      v-if="isParagraph"
      :trigger="['hover']"
      :title="'调整字号'"
      :getPopupContainer="getPopupContainer"
      :overlayClassName="'custom-tool-tip'"
      placement="bottom">
      <div class="selector-box" :class="{'disabled-style': !isParagraph}"
           @click="editor.chain().focus()">
        {{ currentSize }}
        <CaretDownOutlined class="down-arrow-style"/>
      </div>
    </a-tooltip>
    <div v-else class="selector-box" :class="{'disabled-style': !isParagraph}"
         @click="editor.chain().focus()">
      {{ currentSize }}
      <CaretDownOutlined class="down-arrow-style"/>
    </div>
    <template #overlay>
      <div class="list">
        <div
          @click="handleFontSizeChange(item.value)"
          class="list-item"
          :key="index"
          v-for="(item, index) in fontSizeList">
          <CheckOutlined class="check-icon" v-if="articleFontSize === item.value"/>
          {{ item.label }}
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { Dropdown as ADropdown, Tooltip as ATooltip } from 'ant-design-vue';
import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { computed, defineEmits, defineProps, PropType, reactive, ref, VNodeChild } from 'vue';
import { Editor } from '@tiptap/vue-3';

const visible = ref(false);
const emit = defineEmits(['fontSizeChange']);
const articleFontSize = ref('14');

interface MenuInfo {
  key: string;
  keyPath: string[];
  item: VNodeChild;
  domEvent: MouseEvent;
}

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});

const fontSizeList = reactive([
  {
    label: '12px',
    value: '12'
  },
  {
    label: '14px',
    value: '14'
  },
  {
    label: '16px',
    value: '16'
  },
  {
    label: '18px',
    value: '18'
  }
]);
const currentSize = computed(
  () => fontSizeList.find((item) => item.value === articleFontSize.value)?.label
);

const isParagraph = computed(() => props.editor.isActive('paragraph'));

const handleFontSizeChange = (value: string) => {
  articleFontSize.value = value;

  props.editor.chain().focus().setMark('textStyle', { fontSize: value + 'px' }).run();
  console.log('value', value);
  visible.value = false;
  emit('fontSizeChange', { value });
};

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

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
  padding: 10px 0;
  width: 100px;
  border: 1px solid $borderColor;
  border-radius: $borderRadius;
  background: #fff;
  cursor: pointer;
}

.list-item {
  height: 30px;
  line-height: 30px;
  width: 100%;
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
  padding: 4px 6px;
  gap: 10px;
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

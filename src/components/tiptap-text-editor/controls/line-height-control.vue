<template>
  <a-dropdown
    :trigger="['click']"
    :overlayClassName="'dropdown-overlay'"
    v-model:visible="visible"
    :disabled="!isParagraph">
    <!--    <a-tooltip-->
    <!--      :trigger="['hover']"-->
    <!--      :title="'调整行高'"-->
    <!--      :getPopupContainer="getPopupContainer"-->
    <!--      :overlayClassName="'custom-tool-tip'"-->
    <!--      placement="bottom">-->
    <!--      <div class="selector-box"-->
    <!--           @click="editor.chain().focus()">-->
    <!--        {{ currentSize }}-->
    <!--        <LineHeightIcon class="down-arrow-style"/>-->
    <!--      </div>-->
    <!--    </a-tooltip>-->

    <div class="operation-icon" @click="editor.chain().focus()">
      <operation-tooltip :desc="'调整行高'">
        <div class="selector-box">
          <div class="icon">
            <LineHeightIcon
              class="icon-svg"></LineHeightIcon>
          </div>
          <CaretDownOutlined class="down-arrow-style"/>
        </div>
      </operation-tooltip>
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
import { Dropdown as ADropdown } from 'ant-design-vue';
import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { computed, defineEmits, defineProps, PropType, reactive, ref, VNodeChild } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { LineHeightIcon } from '@/components/icons';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

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
    label: '100%',
    value: '100%'
  },
  {
    label: '115%',
    value: '115%'
  },
  {
    label: '150%',
    value: '150%'
  },
  {
    label: '200%',
    value: '200%'
  }
]);
const currentSize = computed(
  () => fontSizeList.find((item) => item.value === articleFontSize.value)?.label
);

const isParagraph = computed(() => props.editor.isActive('paragraph'));

const handleFontSizeChange = (value: string) => {
  articleFontSize.value = value;

  props.editor.commands.setLineHeight(value);
  visible.value = false;
  // emit('fontSizeChange', { value });
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
  padding-right: 6px;
  cursor: pointer;
  border-radius: 6px;
  //margin-left: 8px;

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

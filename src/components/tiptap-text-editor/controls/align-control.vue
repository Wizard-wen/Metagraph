<template>
  <a-dropdown
    :trigger="['click']"
    :overlayClassName="'dropdown-overlay'"
    v-model:visible="visible">
<!--    <a-tooltip-->
<!--      :trigger="['hover']"-->
<!--      :title="'对齐方式'"-->
<!--      :getPopupContainer="getPopupContainer"-->
<!--      :overlayClassName="'custom-tool-tip'"-->
<!--      placement="bottom">-->
<!--      <div class="selector-box"-->
<!--           @click="editor.chain().focus()">-->
<!--&lt;!&ndash;        {{ currentSize }}&ndash;&gt;-->
<!--        <component :is="currentSize"></component>-->
<!--      </div>-->
<!--    </a-tooltip>-->
    <div class="operation-icon" @click="editor.chain().focus()">
      <operation-tooltip :desc="'加粗'">
        <div class="icon">
<!--          <BoldOutlined-->
<!--            class="icon-svg"-->
<!--            :class="{ 'is-active': editor.isActive('bold') }"/>-->
          <component
            :is="currentSize"
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('bold') }"></component>
        </div>
      </operation-tooltip>
    </div>
    <template #overlay>
      <div class="list">
        <div
          @click="handleAlignWayChange(item.value)"
          class="list-item"
          :key="index"
          v-for="(item, index) in alignWayList">
          <component :is="item.component"></component>
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
import { AlignLeftIcon, AlignRightIcon, AlignCenterIcon } from '@/components/icons';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

const visible = ref(false);
const emit = defineEmits(['fontSizeChange']);
const alignWay = ref('left');

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

const alignWayList = reactive([
  {
    label: '左对齐',
    value: 'left',
    component: 'AlignLeftIcon'
  },
  {
    label: '中间对齐',
    value: 'center',
    component: 'AlignCenterIcon'
  },
  {
    label: '右对齐',
    value: 'right',
    component: 'AlignRightIcon'
  },
  {
    label: '两端对齐',
    value: 'justify',
    component: 'AlignLeftIcon'
  }
]);
const currentSize = computed(
  () => alignWayList.find((item) => item.value === alignWay.value)?.component
);

const isParagraph = computed(() => props.editor.isActive('paragraph'));

const handleAlignWayChange = (value: string) => {
  alignWay.value = value;

  props.editor.chain().focus().setMark('textStyle', { fontSize: '20px' }).run();
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

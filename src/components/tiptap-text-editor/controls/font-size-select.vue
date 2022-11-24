<template>
  <a-dropdown :trigger="['click']">
    <a-tooltip :title="'调整字号'" :getPopupContainer="getPopupContainer" :overlayClassName="'custom-tool-tip'">
      <div class="selector-box">
        {{ currentSize }}
        <CaretDownOutlined/>
      </div>
    </a-tooltip>
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
import { computed, defineEmits, reactive, ref } from 'vue';

const emit = defineEmits(['fontSizeChange']);
const articleFontSize = ref('14');

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
const handleFontSizeChange = (value: string) => {
  articleFontSize.value = value;
  emit('fontSizeChange', { value });
};

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

</script>

<style lang="scss">
@import "../../../style/common.scss";
.custom-tool-tip {
  .ant-tooltip-arrow {
    display: none!important;
  }
  &::v-deep(.ant-tooltip-arrow) {
    display: none!important;
  }
}
/* 提示框 */
.ant-tooltip-inner {
  background-color:red;
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

  &:hover {
    background: $hoverBackColor;
  }

  .text {
    font-size: 14px;
  }

  .sanjiao {
    margin-top: 2px;
    width: 0px;
    height: 0px;
    border: 4px solid #000;
    border-top-color: red;
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
  }
}
</style>

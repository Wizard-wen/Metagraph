<template>
  <a-dropdown :trigger="['click']" :overlayClassName="'dropdown-overlay'" v-model:visible="visible">
    <a-tooltip :title="'正文与标题'" :getPopupContainer="getPopupContainer"
               :overlayClassName="'custom-tool-tip'" placement="bottom">
      <div class="selector-box" :class="{'disabled-style': currentTextLevel === '1'}">
        {{ currentTextLevelLabel }}
        <CaretDownOutlined class="down-arrow-style"/>
      </div>
    </a-tooltip>
    <template #overlay>
      <div class="list">
        <div
          @click="handleFontSizeChange(item.value)"
          :class="['list-item', 'list-item-' + index, {'disabled-style': index === 1}]"
          :key="index"
          v-for="(item, index) in textLevelList">
          <CheckOutlined class="check-icon" v-if="currentTextLevel === item.value"/>
          <div class="check-box" v-else></div>
          <div class="content">
            {{ item.label }}
          </div>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { Dropdown as ADropdown, Tooltip as ATooltip } from 'ant-design-vue';
import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { computed, defineEmits, defineProps, PropType, reactive, ref } from 'vue';
import { Editor } from '@tiptap/vue-3';

const visible = ref(false);
const emit = defineEmits(['textLevelChange']);

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});

const textLevelList = reactive([
  {
    label: '正文',
    value: '0'
  },
  {
    label: '正文标题',
    value: '1'
  },
  {
    label: '标题1',
    value: '2'
  },
  {
    label: '标题2',
    value: '3'
  },
  {
    label: '标题3',
    value: '4'
  }
]);

const currentTextLevel = computed(() => {
  if (props.editor.isActive('paragraph')) {
    return '0';
  }
  if (props.editor.isActive('heading', { level: 1 })) {
    return '1';
  }
  if (props.editor.isActive('heading', { level: 2 })) {
    return '2';
  }
  if (props.editor.isActive('heading', { level: 3 })) {
    return '3';
  }
  if (props.editor.isActive('heading', { level: 4 })) {
    return '4';
  }
  return '0';
});
const currentTextLevelLabel = computed(() => textLevelList.find(item => item.value === currentTextLevel.value)?.label);
type LevelType = 1 | 2 | 3 | 4 | 5 | 6;
const handleFontSizeChange = (value: string) => {
  if(value === '1') return;
  visible.value = false;
  if (value !== '0') {
    props.editor.chain()
      .focus()
      .toggleHeading({ level: Number(value) as LevelType })
      .run();
  } else {
    props.editor.chain().focus().setParagraph().run();
  }
  emit('textLevelChange', { value });
};

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

function toggleHeading(level: 2 | 3 | 4) {
  props.editor.chain()
    .focus()
    .toggleHeading({ level })
    .run();
}
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";
@import "../../../style/tiptap.common.scss";

.disabled-style {
  opacity: .2;
  cursor: not-allowed !important;
}

.selector-box {
  min-width: 96px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 4px 4px 8px;
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

.list {
  padding: 10px 0;
  min-width: 100px;
  width: max-content;
  border: 1px solid $borderColor;
  border-radius: $borderRadius;
  background: #fff;
  cursor: pointer;
}

.list-item {
  padding-left: 10px;
  padding-right: 25px;
  min-height: 30px;
  height: max-content;
  line-height: 1.5;
  width: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  .check-box {
    min-width: 24px;
    height: max-content;
  }
  .check-icon {
    font-size: 14px;
    margin-right: 10px;
  }
  .content {
    text-align: left;
  }

  &:hover {
    background: $hoverBackColor;
  }
}

.list-item-1 {
  font-size: 24px;
  line-height: 48px;
  font-weight: bold;
}

.list-item-2 {
  font-size: 18px;
  line-height: 36px;
  font-weight: bold;
}

.list-item-3 {
  font-size: 16px;
  line-height: 32px;
  font-weight: bold;
}
</style>

<template>
  <a-dropdown :trigger="['click']" v-model:visible="visible">
    <a-tooltip :title="'正文与标题'" :getPopupContainer="getPopupContainer"
               :overlayClassName="'custom-tool-tip'" placement="bottom">
      <div class="selector-box">
        {{ currentTextLevelLabel }}
        <CaretDownOutlined/>
      </div>
    </a-tooltip>
    <template #overlay>
      <div class="list">
        <div
          @click="handleFontSizeChange(item.value)"
          class="list-item"
          :key="index"
          v-for="(item, index) in textLevelList">
          <CheckOutlined class="check-icon" v-if="currentTextLevel === item.value"/>
          {{ item.label }}
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
    label: '标题一',
    value: '1'
  },
  {
    label: '标题二',
    value: '2'
  },
  {
    label: '标题三',
    value: '3'
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
  return '0';
});
const currentTextLevelLabel = computed(() => textLevelList.find(item => item.value === currentTextLevel.value)?.label);
type LevelType = 1 | 2 | 3 | 4 | 5 | 6;
const handleFontSizeChange = (value: string) => {
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

function toggleHeading(level: 1 | 2 | 3) {
  props.editor.chain()
    .focus()
    .toggleHeading({ level })
    .run();
}
</script>

<style scoped lang="scss">

</style>

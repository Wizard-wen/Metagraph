<template>
  <div class="panel-item">
    <div class="header">
      <div class="title">{{ title }}</div>
      <div class="control">
        <m-button @click="handleClick" :has-border="false" :is-icon="true">
          <template #icon>
            <EditOutlined
              v-if="!editable"/>
            <SaveOutlined
              v-if="editable"/>
          </template>
        </m-button>
      </div>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@/metagraph-ui';
import { EditOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['change']);

function handleClick() {
  emit('change', !props.editable);
}
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";
.panel-item {
  margin-bottom: 4px;

  .header {
    height: 32px;
    display: flex;
    align-items: center;

    .title {
      flex: 1;
      line-height: 32px;
      font-size: 12px;
      font-weight: 600;
      text-align: left;
    }

    .control {
      height: 32px;
      display: flex;
      align-items: center;
    }
  }
  .content {
    min-height: 20px;
    box-sizing: border-box;
    padding-bottom: 12px;
    width: 100%;
    border-bottom: 1px solid $hoverDeepBackColor;
  }
}
</style>

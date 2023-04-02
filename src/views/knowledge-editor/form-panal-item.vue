<template>
  <div class="panel-item">
    <div class="header">
      <div class="title">{{ title }}</div>
      <div class="control">
        <m-button @click="handleClick" :size="'small'" :has-border="false" :is-icon="true">
          <template #icon>
            <EditOutlined
              v-if="!editable"/>
            <SaveOutlined
              v-if="editable"/>
          </template>
        </m-button>
      </div>
    </div>
    <slot name="content"></slot>
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
.panel-item {
  margin-bottom: 4px;
  .header {
    height: 28px;
    display: flex;
    margin-bottom: 4px;

    .title {
      flex: 1;
      line-height: 28px;
      text-align: left;
    }
  }
}
</style>

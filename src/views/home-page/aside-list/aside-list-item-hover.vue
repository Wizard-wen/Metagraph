<template>
  <ant-popover placement="topLeft">
    <template #content>
      <div class="container">
        <div class="title">
          <LockOutlined v-if="repositoryEntity.content.type === 'private'"/>
          <ReadOutlined v-if="repositoryEntity.content.type === 'public'"/>
          <span>{{ repositoryEntity.content.name }}</span>
        </div>
      </div>
    </template>
  </ant-popover>
</template>

<script lang="ts" setup>
import { EntityCompletelyListItemType } from '@metagraph/constant';
import { defineProps, PropType } from 'vue';
import { Popover as AntPopover } from 'ant-design-vue';
import { LockOutlined, ReadOutlined } from '@ant-design/icons-vue';

defineProps({
  repositoryEntity: {
    type: Object as PropType<EntityCompletelyListItemType>,
    required: true
  }
});
</script>

<style scoped lang="scss">

</style>

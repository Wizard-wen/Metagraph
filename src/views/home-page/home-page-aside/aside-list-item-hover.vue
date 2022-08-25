<template>
  <ant-popover placement="topLeft">
    <template #content>
      <div class="container">
        <div class="title">
          <LockOutlined v-if="repositoryEntity.content.type === 'private'"/>
          <ReadOutlined v-if="repositoryEntity.content.type === 'public'"/>
          <span>{{repositoryEntity.content.name}}</span>
        </div>
      </div>
    </template>
  </ant-popover>
</template>

<script lang="ts">
import { EntityCompletelyListItemType } from 'metagraph-constant';
import { defineComponent, PropType } from 'vue';
import { Popover } from 'ant-design-vue';
import { LockOutlined, ReadOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'aside-list-item-hover',
  props: {
    repositoryEntity: {
      type: Object as PropType<EntityCompletelyListItemType>,
      required: true
    }
  },
  components: {
    AntPopover: Popover
  }
});
</script>

<style scoped lang="scss">

</style>

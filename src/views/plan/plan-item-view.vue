<template>
  <div class="plan-item-card">
    <div class="content"
         :style="{background: isShow ? '#fafafa': '#FFF' }"
         @mouseenter="isShow = true" @mouseleave="isShow = false">
      <EditOutlined v-if="isShow" class="control" @click="handleClickEdit"/>
      <div class="priority-tags">
        <div v-for="item in planItem.priority"
             class="priority-tag-item"
             :class="planItem.status + '-tag-color'"></div>
      </div>
      <div class="name">{{ planItem.name }}</div>
      <div class="entity-list">
        <ant-tag
          closable
          @close="handleClose(item.entity.id)"
          :key="index"
          v-for="(item, index) in entityList">{{ item.content.name }}
        </ant-tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EntityCompletelyListItemType, PlanItemModelType } from 'metagraph-constant';
import { defineComponent, PropType, ref } from 'vue';
import { Tag } from 'ant-design-vue';
import { EditOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'plan-item-view',
  components: {
    AntTag: Tag,
    EditOutlined
  },
  props: {
    planItem: {
      type: Object as PropType<PlanItemModelType>,
      required: true
    },
    entityList: {
      type: Array as PropType<EntityCompletelyListItemType[]>,
    }
  },
  emits: ['edit', 'close'],
  setup(props, { emit }) {
    function handleClickEdit() {
      emit('edit', {
        id: props.planItem.id
      });
    }

    const isShow = ref(false);

    function handleClose(entityId: string) {
      emit('close', {
        id: props.planItem.id,
        entityId
      });
    }

    return {
      isShow,
      handleClickEdit,
      handleClose
    };
  }
});
</script>

<style scoped lang="scss">
.plan-item-card {
  max-height: 371px;
  width: 100%;
  background: #f5f5f5;
  padding: 10px 10px 8px;
  border-radius: 4px;

  .content {
    background: #FFF;
    padding-top: 3px;
    position: relative;

    &:hover {
      cursor: pointer;
    }

    .control {
      position: absolute;
      top: 5px;
      right: 10px;
    }

    .priority-tags {
      height: 24px;
      display: flex;
      gap: 5px;
      max-width: 200px;

      .priority-tag-item {
        height: 12px;
        width: 20%;
        max-width: 32px;
        background: rgb(204, 51, 51);
        border-radius: 3px;
      }

      .done-tag-color {
        background: rgb(0, 144, 0)
      }

      .doing-tag-color {
        background: rgb(135, 206, 235)
      }

      .todo-tag-color {
        background: rgb(204, 51, 51);
      }
    }

    .name {
      line-height: 35px;
      padding: 0 5px;
      text-align: left;
      font-size: 14px;
    }

    .entity-list {
      background: #f5f5f5;
      padding-top: 8px;
      display: flex;
      justify-content: flex-start;
      gap: 10px;
    }
  }

}
</style>

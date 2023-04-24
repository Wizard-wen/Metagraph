<template>
  <div
    class="plan-item-card"
    @mouseenter="isShow = true"
    @mouseleave="isShow = false">
    <div class="content">
      <EditOutlined v-if="isShow" class="control" @click="handleClickEdit"/>
      <div class="priority-tags">
        <div
          v-for="(item ,index) in planItem.priority"
          :key="index"
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

<script lang="ts" setup>
import { EntityCompletelyListItemType, PlanItemModelType } from '@metagraph/constant';
import { defineEmits, defineProps, PropType, ref } from 'vue';
import { Tag as AntTag } from 'ant-design-vue';
import { EditOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  planItem: {
    type: Object as PropType<PlanItemModelType>,
    required: true
  },
  entityList: {
    type: Array as PropType<EntityCompletelyListItemType[]>,
  }
});

const emit = defineEmits(['edit', 'close']);

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
</script>

<style scoped lang="scss">
.plan-item-card {
  max-height: 371px;
  width: 100%;
  background: #fff;
  padding: 10px 10px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 12px;
  //box-shadow: 0 0 1px -1px rgb(0 0 0 / 8%), 0 1px 2px 0 rgb(0 0 0 / 4%), 0 2px 4px 1px rgb(0 0 0 / 2%);
  box-shadow: 0 1px 4px -2px rgb(0 0 0 / 13%), 0 2px 8px 0 rgb(0 0 0 / 8%), 0 8px 16px 4px rgb(0 0 0 / 4%);
  //&:hover {
  //  box-shadow: 0 1px 4px -2px rgb(0 0 0 / 13%), 0 2px 8px 0 rgb(0 0 0 / 8%), 0 8px 16px 4px rgb(0 0 0 / 4%);
  //}


  .content {
    background: #FFF;
    //padding-top: 3px;
    position: relative;
    min-height: 50px;

    //&:hover {
    //  cursor: pointer;
    //}

    .control {
      position: absolute;
      top: 5px;
      right: 10px;
    }

    .priority-tags {
      height: 7px;
      display: flex;
      align-items: center;
      //gap: 5px;
      max-width: 200px;

      .priority-tag-item {
        height: 4px;
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
      //background: #f5f5f5;
      padding-top: 8px;
      display: flex;
      justify-content: flex-start;
      gap: 10px;
    }
  }

}
</style>

<template>
  <div class="plan-panel">
    <div class="vertical-box">
      <div class="plan-panel-vertical">
        <div class="plan-list-header">待学习</div>
        <div class="plan-list-content">
          <vue-draggable
            class="plan-list-group"
            :list="planBoard.todoList"
            group="people"
            @change="handleTodo"
            itemKey="name">
            <template #item="{ element }">
              <plan-item-view
                :plan-item="element.item"
                :entity-list="element.entityList"
                @close="handleRemoveTag($event)"
                @edit="handleEditPlanItem($event)"></plan-item-view>
            </template>
          </vue-draggable>
          <div class="add-list-item">添加</div>
        </div>

      </div>
      <div class="plan-panel-vertical">
        <div class="plan-list-header">学习中</div>
        <vue-draggable
          class="list-group"
          :list="planBoard.doingList"
          group="people"
          @change="handleDoing"
          itemKey="name">
          <template #item="{ element }">
            <plan-item-view
              :plan-item="element.item"
              :entity-list="element.entityList"
              @close="handleRemoveTag($event)"
              @edit="handleEditPlanItem($event)"></plan-item-view>
          </template>
        </vue-draggable>
      </div>
      <div class="plan-panel-vertical">
        <div class="plan-list-header">已学完</div>
        <vue-draggable
          class="list-group"
          :list="planBoard.doneList"
          group="people"
          @change="handleDone"
          itemKey="name">
          <template #item="{ element }">
            <plan-item-view
              :entity-list="element.entityList"
              :plan-item="element.item"></plan-item-view>
          </template>
        </vue-draggable>
      </div>
      <!--      <div class="add-item">添加一列</div>-->
    </div>
    <div class="new-line">
      <!--      <div class="add-item">添加一行</div>-->
    </div>

  </div>
</template>

<script lang="ts" setup>
import VueDraggable from 'vuedraggable';
import { PlanBoard, planBoard } from '@/views/plan/plan-board/plan.board';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import PlanItemView from './plan-item-view.vue';

const planBoardService = new PlanBoard();

const route = useRoute();
const planId = ref(route.query.id as string);

async function handleRemoveTag(params: {
  id: string,
  entityId: string
}) {
  await planBoardService.unbindEntityFromPlanItem({
    entityId: params.entityId,
    planItemId: params.id,
    planId: planId.value
  });
  await planBoardService.getPlan(planId.value);
}

function handleEditPlanItem(params: { id: string }) {
  // isShowModal.value = true;
  // planItemId.value = params.id;
}

async function handlePlanItemStatus(evt: any, status: 'todo' | 'doing' | 'done') {
  if (evt.added) {
    const result = await planBoardService.updatePlanItem(evt.added.element.item.id, status);
    if (result) {
      await planBoardService.getPlan(planId.value);
    }
  }
  if (evt.removed) {
    // stack.value.push(evt.removed.element);
  }
  if (evt.moved) {
    console.log(evt.moved);
  }
}


async function handleDoing(evt: any) {
  await handlePlanItemStatus(evt, 'doing');
}

async function handleTodo(evt: any) {
  await handlePlanItemStatus(evt, 'todo');
}

async function handleDone(evt: any) {
  await handlePlanItemStatus(evt, 'done');
}

</script>

<style scoped lang="scss">
@import "../../../style/common.scss";
.plan-panel {
  width: 100%;
  padding: 20px;

  .vertical-box {
    display: flex;
  }

  .new-line {
    display: flex;
    justify-content: flex-start;
  }

  .plan-panel-vertical {
    width: 280px;
    height: max-content;
    margin-bottom: 10px;
    margin-right: 10px;
    padding: 0 10px 32px;
    border-radius: 6px;
    background: $hoverDeepBackColor;
    position: relative;

    .plan-list-header {
      height: 32px;
      line-height: 32px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
    }

    .plan-list-content {
      //padding: 10px 0;

      .add-list-item {
        position: absolute;
        bottom: 0;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
      }
    }

    .plan-list-group {
      min-height: 20px;
    }

  }

  .add-item {
    height: 32px;
    width: 280px;
    line-height: 32px;
    border-radius: 4px;
    cursor: pointer;
    background: rgba(0, 0, 0, .12);
    color: #FFF;

    &:hover {
      background: rgba(0, 0, 0, .2);
    }
  }
}
</style>

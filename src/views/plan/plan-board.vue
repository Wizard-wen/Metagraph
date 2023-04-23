<template>
  <div class="plan-board">
    <plan-board-header
      :view-status="currentView"
      @viewChange="handleViewChange"
      @open="isShowModal = true"></plan-board-header>
    <!--    <ant-progress :percent="donePercent"/>-->
    <div class="plan-board-content">
      <div class="plan-board-left-side">
        <plan-board-panel
          v-if="currentView === 'card'"
          @createPlanItem="isShowModal = true"></plan-board-panel>
        <plan-progress
          v-if="currentView === 'burnDown'"
          :plan-item-list="planBoard.list"></plan-progress>
      </div>
      <plan-board-rightbar></plan-board-rightbar>
    </div>
  </div>
  <plan-item-edit-modal
    v-if="isShowModal && planBoard.data"
    @close="closePlanItemModal"
    :is-modal-visible="isShowModal"
    :plan-model="planBoard.data"
    :plan-item-id="planItemId"
    :plan-id="planId"></plan-item-edit-modal>
</template>

<script lang="ts" setup>
import PlanItemEditModal from '@/views/plan/plan-item-edit-modal.vue';
import { computed, createVNode, onMounted, ref } from 'vue';
import {
  message,
  Modal
} from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import PlanProgress from '@/views/plan/plan-board/plan-progress.vue';
import PlanBoardHeader from '@/views/plan/plan-board/plan-board-header.vue';
import PlanBoardPanel from '@/views/plan/plan-board/plan-board-panel.vue';
import PlanBoardRightbar from '@/views/plan/plan-board/plan-board-rightbar.vue';
import { planBoard, PlanBoard } from './plan-board/plan.board';


const route = useRoute();
const planId = ref(route.query.id as string);
const isShowModal = ref(false);
const currentView = ref<'card' | 'burnDown'>('card');

const planItemId = ref();
const priorityUp = ref(false);
const isFormDisabled = ref(true);
const planBoardService = new PlanBoard();

const donePercent = computed(
  () => Math.round((planBoard.value.doneList.length / planBoard.value.list.length) * 100)
);

function handleViewChange(event: 'card' | 'burnDown') {
  currentView.value = event;
}

async function closePlanItemModal() {
  isShowModal.value = false;
  await planBoardService.getPlan(planId.value);
}

function handleSavePlan() {

}


function bindEntity() {

}


async function unbindEntityFromPlan(entityId: string) {
  Modal.confirm({
    title: '确定要从计划中解绑实体吗?',
    okText: '确定',
    cancelText: '取消',
    zIndex: 9001,
    icon: createVNode(ExclamationCircleOutlined),
    content: '该操作不可逆，确定要解绑吗？',
    async onOk() {
      await planBoardService.unbindEntityFromPlan({
        entityId,
        planId: planId.value
      });
      await planBoardService.getPlan(planId.value);
    },
    async onCancel() {
      message.info('取消解绑');
    },
  });
}


function handleFilter() {

}


onMounted(async () => {
  await planBoardService.getPlan(planId.value);
});

</script>

<style scoped lang="scss">
@import "../../style/common.scss";
.plan-board {
  width: 100%;
  height: 100vh;

  .plan-board-content {
    height: calc(100vh - 56px);
    width: 100%;
    display: flex;

    .plan-board-left-side {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      @include custom-scroll-style;
    }
  }

  .entity-list-header {
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
    text-align: left;
  }

  .plan-panel-header {
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
  }

  .custom-ant-list {

    &::v-deep(.ant-list-header) {
      padding: 0;
    }
  }

  .plan-content {
    .operation-header {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid #f0f0f0;
    }

    .plan-list-header {
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      font-weight: bold;
    }
  }

}

.custom-list-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}


</style>

<template>
  <div class="plan-board">
    <plan-board-header @open="isShowModal = true"></plan-board-header>
<!--    <ant-progress :percent="donePercent"/>-->
    <div class="plan-board-content">
      <div class="plan-board-left-side">
        <plan-board-panel></plan-board-panel>
              <plan-progress :plan-item-list="planBoard.list"></plan-progress>
      </div>
      <plan-board-rightbar></plan-board-rightbar>
    </div>
  </div>



  <!--  <ant-spin :spinning="isLoading">-->
  <!--    <ant-row class="plan-board" :gutter="[10,0]">-->
  <!--      <ant-col :span="4">-->

  <!--      </ant-col>-->
  <!--      <ant-col :span="15">-->
  <!--        <div class="plan-content">-->

  <!--          -->
  <!--          <ant-row :gutter="[10,16]">-->
  <!--            -->
  <!--          </ant-row>-->
  <!--        </div>-->
  <!--      </ant-col>-->
  <!--      <ant-col :span="5">-->

  <!--      </ant-col>-->
  <!--    </ant-row>-->
  <!--    -->
  <!--  </ant-spin>-->
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
  Form as AntForm,
  Input as AntInput,
  List as AntList,
  message,
  Modal,
  Progress as AntProgress
} from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import PlanProgress from '@/views/plan/plan-board/plan-progress.vue';
import { planBoard, PlanBoard } from './plan-board/plan.board';
import PlanBoardHeader from '@/views/plan/plan-board/plan-board-header.vue';
import PlanBoardPanel from '@/views/plan/plan-board/plan-board-panel.vue';
import PlanBoardRightbar from '@/views/plan/plan-board/plan-board-rightbar.vue';

const AntFormItem = AntForm.Item;
const AntTextarea = AntInput.TextArea;
const AntListItem = AntList.Item;

const route = useRoute();
const planId = ref(route.query.id as string);
const isShowModal = ref(false);

const planItemId = ref();
const priorityUp = ref(false);
const isFormDisabled = ref(true);
const planBoardService = new PlanBoard();

const donePercent = computed(
  () => Math.round((planBoard.value.doneList.length / planBoard.value.list.length) * 100)
);


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
// export default defineComponent({
//   name: 'plan-board',
//   components: {
//     PlanProgress,
//     PlanItemEditModal,
//     draggable,
//     AntRow: Row,
//     AntCol: Col,
//     AntSpin: Spin,
//     AntList: List,
//     AntSelect: Select,
//     AntSelectOption: Select.Option,
//     AntListItem: List.Item,
//     AntButton: Button,
//     AntForm: Form,
//     AntFormItem: Form.Item,
//     AntRadio: Radio,
//     AntRadioGroup: Radio.Group,
//     AntInput: Input,
//     AntTextArea: Input.TextArea,
//     AntProgress: Progress,
//     AntDatePicker: DatePicker,
//     PlusCircleOutlined,
//     LockOutlined,
//     PlanItemView,
//     UnlockOutlined,
//     SaveOutlined,
//     EditOutlined
//   },
//   setup() {
//
//
//     return {
//       drag: false,
//       planBoard,
//       addPlanItem,
//       planId,
//       isShowModal,
//       planItemId,
//       closePlanItemModal,
//       handleDoing,
//       handleTodo,
//       handleDone,
//       handleEditPlanItem,
//       priorityUp,
//       filterFormState,
//       handleFilter,
//       handleChange,
//       bindEntity,
//       isFormDisabled,
//       planFormState,
//       handleSavePlan,
//       planBindEntityList,
//       handleRemoveTag,
//       unbindEntityFromPlan,
//       isLoading,
//       donePercent
//     };
//   }
// });
</script>

<style scoped lang="scss">

.plan-board {
  width: 100%;
  height: 100%;

  .plan-board-content {
    height: calc(100% - 56px);
    display: flex;
    .plan-board-left-side {
      flex: 1;
      height: 100%;
      overflow-y: auto;
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

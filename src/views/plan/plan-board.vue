<template>
  <div></div>






  <ant-spin :spinning="isLoading">
    <ant-row class="plan-board" :gutter="[10,0]">
      <ant-col :span="4">
        <ant-list class="custom-ant-list" :dataSource="planBindEntityList">
          <template #header>
            <div class="entity-list-header">
              <span>实体列表</span>
              <PlusCircleOutlined style="font-size: 16px;" @click="bindEntity"/>
            </div>
          </template>
          <template #renderItem="{ item }">
            <ant-list-item style="padding: 7px 0">
              <div class="custom-list-item">
                <LockOutlined v-if="item.planEntityModel.isInnerPlanItem"/>
                <UnlockOutlined v-else/>
                {{ item.entity.content.name }}
              </div>
              <template #actions v-if="!item.planEntityModel.isInnerPlanItem">
                <a @click="unbindEntityFromPlan(item.entity.entity.id)">解绑</a>
              </template>
            </ant-list-item>
          </template>
        </ant-list>
      </ant-col>
      <ant-col :span="15">
        <div class="plan-content">

          <ant-progress :percent="donePercent"/>
          <ant-row :gutter="[10,16]">
            <ant-col :span="8">
              <div class="plan-list-header">待学习</div>
              <draggable
                class="list-group"
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
              </draggable>
            </ant-col>
            <ant-col :span="8">
              <div class="plan-list-header">学习中</div>
              <draggable
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
              </draggable>
            </ant-col>
            <ant-col :span="8">
              <div class="plan-list-header">已学完</div>
              <draggable
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
              </draggable>
            </ant-col>
          </ant-row>
        </div>
      </ant-col>
      <ant-col :span="5">
        <div class="plan-panel-header">
          <span>{{ planBoard.data?.name || '-' }}</span>
          <SaveOutlined
            style="font-size: 16px;"
            v-if="!isFormDisabled" @click="handleSavePlan"/>
          <EditOutlined
            style="font-size: 16px;"
            v-if="isFormDisabled" @click="isFormDisabled = false"/>
        </div>
        <ant-form
          layout="vertical"
          :model="planFormState"
          @submit="handleFilter">
          <ant-form-item
            style="margin-top: 20px;margin-bottom: 10px" ref="name" label="计划名" name="name">
            <ant-input :disabled="isFormDisabled" v-model:value="planFormState.name"/>
          </ant-form-item>
          <ant-form-item style="margin-bottom: 10px" ref="planDate" label="起始日" name="planDate">
            <ant-date-picker
              :disabled="isFormDisabled"
              style="width: 100%;"
              :dropdownClassName="'custom-date-picker'"
              :format="'YYYY/MM/DD'" v-model:value="planFormState.planDate"/>
          </ant-form-item>
          <ant-form-item
            style="margin-bottom: 10px" ref="deadlineDate" label="截止日" name="deadlineDate">
            <ant-date-picker
              :disabled="isFormDisabled"
              style="width: 100%;"
              :dropdownClassName="'custom-date-picker'"
              :format="'YYYY/MM/DD'" v-model:value="planFormState.deadlineDate"/>
          </ant-form-item>
          <ant-form-item ref="description" label="描述" name="description">
            <ant-text-area :disabled="isFormDisabled" v-model:value="planFormState.description"/>
          </ant-form-item>
        </ant-form>
      </ant-col>
    </ant-row>
    <plan-progress></plan-progress>
  </ant-spin>
  <plan-item-edit-modal
    v-if="isShowModal && planBoard.data"
    @close="closePlanItemModal"
    :is-modal-visible="isShowModal"
    :plan-model="planBoard.data"
    :plan-item-id="planItemId"
    :plan-id="planId"></plan-item-edit-modal>
</template>

<script lang="ts">
import PlanItemEditModal from '@/views/plan/plan-item-edit-modal.vue';
import {
  computed,
  createVNode,
  defineComponent, onMounted, ref
} from 'vue';
import {
  Row, Col, List, Button, Form, Radio, Input, DatePicker, Spin, Modal, message,
  Select, Progress
} from 'ant-design-vue';
import { useRoute } from 'vue-router';
import {
  PlusCircleOutlined, LockOutlined, SaveOutlined, EditOutlined,
  ExclamationCircleOutlined, UnlockOutlined
} from '@ant-design/icons-vue';
import draggable from 'vuedraggable';
import {
  planBoard, PlanBoard, planFormState, planBindEntityList, isLoading
} from './plan.board';
import PlanItemView from './plan-item-view.vue';
import PlanProgress from '@/views/plan/plan-board/plan-progress.vue';

export default defineComponent({
  name: 'plan-board',
  components: {
    PlanProgress,
    PlanItemEditModal,
    draggable,
    AntRow: Row,
    AntCol: Col,
    AntSpin: Spin,
    AntList: List,
    AntSelect: Select,
    AntSelectOption: Select.Option,
    AntListItem: List.Item,
    AntButton: Button,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntRadio: Radio,
    AntRadioGroup: Radio.Group,
    AntInput: Input,
    AntTextArea: Input.TextArea,
    AntProgress: Progress,
    AntDatePicker: DatePicker,
    PlusCircleOutlined,
    LockOutlined,
    PlanItemView,
    UnlockOutlined,
    SaveOutlined,
    EditOutlined
  },
  setup() {
    const route = useRoute();
    const planId = ref(route.query.id as string);
    const isShowModal = ref(false);
    const planBoardService = new PlanBoard();
    const planItemId = ref();
    const priorityUp = ref(false);
    const isFormDisabled = ref(true);


    const donePercent = computed(
      () => Math.round((planBoard.value.doneList.length / planBoard.value.list.length) * 100)

    );

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

    function handleEditPlanItem(params: { id: string }) {
      isShowModal.value = true;
      planItemId.value = params.id;
    }



    async function closePlanItemModal() {
      isShowModal.value = false;
      await planBoardService.getPlan(planId.value);
    }

    function handleSavePlan() {

    }



    function bindEntity() {

    }

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



    onMounted(async () => {
      await planBoardService.getPlan(planId.value);
    });

    return {
      drag: false,
      planBoard,
      addPlanItem,
      planId,
      isShowModal,
      planItemId,
      closePlanItemModal,
      handleDoing,
      handleTodo,
      handleDone,
      handleEditPlanItem,
      priorityUp,
      filterFormState,
      handleFilter,
      handleChange,
      bindEntity,
      isFormDisabled,
      planFormState,
      handleSavePlan,
      planBindEntityList,
      handleRemoveTag,
      unbindEntityFromPlan,
      isLoading,
      donePercent
    };
  }
});
</script>

<style scoped lang="scss">

.plan-board {
  margin: 0 auto !important;
  width: 100%;
  max-width: 1440px;
  display: flex;
  padding-top: 50px;

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

.list-group {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  min-height: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>

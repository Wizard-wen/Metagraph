<template>
  <div class="plan-board-header">
    <div class="left-side">
      <div class="left-container">
        <m-button :is-icon="true" :has-border="false" @click="goHomePage">
          <template #icon>
            <LeftOutlined/>
          </template>
        </m-button>
        <ant-dropdown
          :getPopupContainer="getPopupContainer"
          :trigger="['click']"
          :placement="'bottomLeft'">
          <m-button :is-icon="true" :has-border="false">
            <template #icon>
              <MenuOutlined/>
            </template>
          </m-button>
          <template #overlay>
            <ant-menu class="dropdown-menu-style">
              <div class="divider-style"></div>
              <ant-menu-item class="menu-item-style">
                <ArrowLeftOutlined class="icon-size"/>
                回到首页
              </ant-menu-item>
            </ant-menu>
          </template>
        </ant-dropdown>
        <div class="page-title">计划面板</div>
      </div>
    </div>
    <div class="middle-side">
      <m-checkbox
        style="width: 200px; height: 36px"
        :type="'checkbox'"
        :modelValue="viewStatus"
        @update:modelValue="handlePlanViewChange"
        :option-list="optionList"></m-checkbox>
    </div>
    <div class="right-side">
      <ant-button type="primary" @click="addPlanItem">创建计划项</ant-button>
      <!--      <ant-form-->
      <!--        layout="inline"-->
      <!--        :model="filterFormState"-->
      <!--        @submit="handleFilter">-->
      <!--        <ant-form-item name="type">-->
      <!--          <ant-select v-model:value="filterFormState.type">-->
      <!--            <ant-select-option value="priority">优先级</ant-select-option>-->
      <!--            <ant-select-option disabled value="deadlineDate">截止日</ant-select-option>-->
      <!--            <ant-select-option disabled value="planDate">计划日</ant-select-option>-->
      <!--          </ant-select>-->
      <!--        </ant-form-item>-->
      <!--        <ant-form-item name="priority">-->
      <!--          <ant-radio-group v-model:value="filterFormState.orderBy" @change="handleChange">-->
      <!--            <ant-radio :value="-1">倒序</ant-radio>-->
      <!--            <ant-radio :value="1">正序</ant-radio>-->
      <!--            <ant-radio :value="0">默认</ant-radio>-->
      <!--          </ant-radio-group>-->
      <!--        </ant-form-item>-->
      <!--      </ant-form>-->
    </div>

  </div>
</template>

<script lang="ts" setup>
import {
  Button as AntButton,
  Dropdown as AntDropdown,
  Form as AntForm,
  Menu as AntMenu,
  Radio as AntRadio,
  Select as AntSelect,
} from 'ant-design-vue';
import { PlanBoard, planBoard, } from '@/views/plan/plan-board/plan.board';
import { defineEmits, defineProps, PropType, ref } from 'vue';
import { RouterUtil } from '@/utils';
import { MButton, MCheckbox } from '@/metagraph-ui';
import { ArrowLeftOutlined, LeftOutlined, MenuOutlined } from '@ant-design/icons-vue';


const AntMenuItem = AntMenu.Item;

const AntFormItem = AntForm.Item;
const AntRadioGroup = AntRadio.Group;
const AntSelectOption = AntSelect.Option;
const planBoardService = new PlanBoard();
defineProps({
  viewStatus: {
    type: String as PropType<'card' | 'burnDown'>,
    required: true
  },
});

const optionList = ref([
  { key: 'card', name: '卡片' },
  { key: 'burnDown', name: '燃尽图' }
]);

const emit = defineEmits(['open', 'viewChange']);
const filterFormState = ref<{
  orderBy: 1 | -1 | 0,
  // type: 'priority' | 'planDate' | 'deadlineDate'
  type: 'priority'
}>({
  orderBy: 0,
  type: 'priority'
});

function goHomePage() {
  RouterUtil.jumpTo('/');
}

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

function handlePlanViewChange(status: 'section' | 'graph') {
  emit('viewChange', status);
}

function handleFilter() {

}

function addPlanItem() {
  planBoardService.clearPlanItem();
  emit('open');
}

function handleChange(event: any) {
  console.log(event);
  const { type } = filterFormState.value;
  if (event.target.value === 1) {
    planBoard.value.doingList.sort((a, b) => a.item[type] - b.item[type]);
    planBoard.value.todoList.sort((a, b) => a.item[type] - b.item[type]);
    planBoard.value.doneList.sort((a, b) => a.item[type] - b.item[type]);
  } else if (event.target.value === -1) {
    planBoard.value.doingList.sort((a, b) => b.item[type] - a.item[type]);
    planBoard.value.todoList.sort((a, b) => b.item[type] - a.item[type]);
    planBoard.value.doneList.sort((a, b) => b.item[type] - a.item[type]);
  } else {
    console.log(planBoard.value.todoList);
    planBoard.value.doingList.length && planBoard.value.doingList.sort(
      (a, b) => b.item.updatedAt.getTime() - a.item.updatedAt.getTime()
    );
    planBoard.value.todoList.length && planBoard.value.todoList.sort(
      (a, b) => {
        console.log(b.item.updatedAt, b.item.updatedAt.getTime());
        return b.item.updatedAt.getTime() - a.item.updatedAt.getTime();
      }
    );
    planBoard.value.doneList.length && planBoard.value.doneList.sort(
      (a, b) => b.item.updatedAt.getTime() - a.item.updatedAt.getTime()
    );
  }
}
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.plan-board-header {
  height: 56px;
  display: flex;
  padding: 0 24px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $hoverDeepBackColor;

  .left-side {
    display: flex;
    align-items: center;

    .left-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
      width: 288px;

      .page-title {
        font-size: 16px;
        margin-left: 15px;
        margin-right: 100px;
        font-weight: 600;
      }
    }
  }

  .middle-side {
    position: absolute;
    top: 12px;
    left: calc(50% - 110px);
  }

  .right-side {
    display: flex;
  }
}
</style>

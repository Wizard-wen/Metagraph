<template>
  <div class="card-item">
    <section class="header">
      <div class="header-content">
        <div class="title" @click="handleClickTitle(planItem)">
          {{ planItem.name }}
        </div>
        <div class="edit-btn" @click="handleEdit(planItem)">
          <EditOutlined/>
        </div>
      </div>
    </section>
    <div class="content">
      <div class="inner-content">
        <div class="list-container">
          <div class="list-item">
            <div class="circle"></div>
            已完成{{ planItem.progress.done }}
          </div>
          <div class="list-item">
            <div class="circle"></div>
            进行中{{ planItem.progress.doing }}
          </div>
          <div class="list-item">
            <div class="circle"></div>
            未开始{{ planItem.progress.todo }}
          </div>
        </div>
        <a-tooltip :title="progressDesc">
          <a-progress
            :width="90" :percent="totalRate" :success="{
              percent: successRate,
              strokeColor: 'red'
            }"
            type="circle"/>
        </a-tooltip>
      </div>
      <div class="bottom">
        <div class="deadline">
          {{ lastTime }}
        </div>
        <div class="status-tag">{{ planItem.entityCount }}个知识点</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlanListItemType, PlanModelType } from 'metagraph-constant';
import { computed, defineEmits, defineProps, PropType } from 'vue';
import { EditOutlined } from '@ant-design/icons-vue';
import { Progress as AProgress, Tooltip as ATooltip } from 'ant-design-vue';
import { ceil } from 'lodash';

// startDate 活动开始日期
// endDate 活动截止日期
function endDistance(startDate: Date, endDate: Date): string {
  // 获取相差毫秒数
  const leftTime = endDate.getTime() - startDate.getTime();
  // 转化时间

  // 1000毫秒 = 1秒
  // 60秒 = 1分钟
  // 60分钟 = 1小时
  // 60小时 = 1日
  const d = Math.floor(leftTime / 1000 / 60 / 60 / 24);

  // 所以利用 % 求余运算符，就可以将其 除于小时或小时或分数 然后将余数赋值，见下例
  // 天数剩下的余数就是剩下的小时
  const h = Math.floor((leftTime / 1000 / 60 / 60) % 24);

  // 小时剩下的余数就是剩下的分钟
  const m = Math.floor((leftTime / 1000 / 60) % 60);

  // 分数剩下的余数就是剩下的秒数
  const s = Math.floor((leftTime / 1000) % 60);
  if (d < 0 || h < 0 || m < 0 || s < 0) {
    return '已过期';
  }
  if (d > 0) {
    return `剩余${d}天`;
  }
  if (d === 0 && h > 0) {
    return `剩余${h}小时`;
  }
  return '即将到期';
}

const props = defineProps({
  planItem: {
    type: Object as PropType<PlanListItemType>,
    required: true
  }
});

const successRate = computed(() => {
  if (props.planItem.progress.total > 0) {
    return ceil(props.planItem.progress.done / props.planItem.progress.total, 2) * 100;
  }
  return 0;
});

const totalRate = computed(() => {
  if (props.planItem.progress.total > 0) {
    return ceil((props.planItem.progress.done + props.planItem.progress.doing) / props.planItem.progress.total, 2) * 100;
  }
  return 0;
});
const progressDesc = computed(() => `
${props.planItem.progress.done} 已完成 /
${props.planItem.progress.doing} 进行中 /
${props.planItem.progress.todo} 待完成`);

const lastTime = computed(() => props.planItem.deadlineDate ? endDistance(new Date(), new Date(props.planItem.deadlineDate)) : '');

const emit = defineEmits(['clickTitle', 'edit']);

function handleClickTitle(item: PlanModelType) {
  emit('clickTitle', item.id);
}

function handleEdit(item: PlanModelType) {
  emit('edit', item.id);
}
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.card-item {
  width: 288px;
  border: 1px solid $borderColor;
  border-radius: $borderRadius;

  .header {
    padding: 0 10px;

    .header-content {
      height: 40px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        cursor: pointer;
        min-width: 120px;
        width: max-content;
        text-align: left;
      }

      .edit-btn {
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        &:hover {
          cursor: pointer;
          background: $hoverBackColor;
        }
      }
    }
  }

  .content {
    padding: 10px;
    min-height: 80px;
    width: 100%;

    .inner-content {
      padding: 0 10px 10px;
      height: 110px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .list-container {
        height: 90px;

        .list-item {
          display: flex;
          align-items: center;
          text-align: left;
          font-size: 12px;
          line-height: 28px;

          .circle {
            height: 4px;
            width: 4px;
            margin-right: 3px;
            border-radius: 2px;
            background: #2ea44f;
          }
        }
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .deadline {
        font-size: 12px;
        line-height: 1;
      }

      .status-tag {
        height: 18px;
        width: max-content;
        padding: 0 4px;
        font-size: 12px;
        border: 1px solid $borderColor;
        border-radius: 4px;
      }
    }

  }
}
</style>

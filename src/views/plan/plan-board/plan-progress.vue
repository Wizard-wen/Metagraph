<template>
  <div class="table-container">
    <div class="progress-line table-header">
      <div
        v-for="(item, index) in totalDate"
        :key="index" class="progress-item-title">{{ index + 1 }}
      </div>
    </div>

    <div v-for="(item, index) in planViewList" :key="index" class="progress-line">
      <div
        v-for="(innerItem, innerIndex) in totalDate"
        :key="innerIndex"
        :class="{
            'active-progress-item': innerIndex >= item.start && innerIndex <= item.end,
            'active-progress-item-left': innerIndex === item.start,
            'active-progress-item-right': innerIndex === item.end,
        }"
        class="progress-item"></div>
    </div>
  </div>

</template>

<script lang="ts" setup>

import { defineProps, PropType, ref, watchEffect } from 'vue';
import { EntityCompletelyListItemType, PlanItemModelType } from '@metagraph/constant';

const props = defineProps({
  planItemList: {
    type: Array as PropType<{
      item: PlanItemModelType;
      entityList: EntityCompletelyListItemType[];
      entityIdList: string[];
    }[]>,
    required: true
  }
});

const planViewList = ref([{
  id: 1, name: '1', start: 2, end: 10
}, {
  id: 1, name: '1', start: 1, end: 3
}, {
  id: 1, name: '1', start: 5, end: 6
}, {
  id: 1, name: '1', start: 12, end: 18
}]);

function getDays(date1: string | Date, date2: string | Date) {
  let date1Obj: Date;
  let date2Obj: Date;
  if (typeof date1 === 'string') {
    const date1Str = date1.split('-').map((item) => Number(item));// 将日期字符串分隔为数组,数组元素分别为年.月.日
    // 根据年 . 月 . 日的值创建Date对象
    date1Obj = new Date(date1Str[0], (date1Str[1] - 1), date1Str[2]);
  } else {
    date1Obj = date1;
  }
  if (typeof date2 === 'string') {
    const date2Str = date2.split('-').map((item) => Number(item));
    date2Obj = new Date(date2Str[0], (date2Str[1] - 1), date2Str[2]);
  } else {
    date2Obj = date2;
  }
  const t1 = date1Obj.getTime();
  const t2 = date2Obj.getTime();
  const dateTime = 1000 * 60 * 60 * 24; // 每一天的毫秒数
  const minusDays = Math.floor(((t2 - t1) / dateTime));// 计算出两个日期的天数差
  // 取绝对值
  return Math.abs(minusDays);
}

const totalDate = ref(20);
watchEffect(() => {
  if (!props.planItemList.length) {
    return;
  }
  const obj = props.planItemList.reduce((pre: {
    start: number, end: number
  }, cur) => {
    if (pre.start) {
      if (new Date(cur.item.planDate).getTime() < pre.start) {
        pre.start = new Date(cur.item.planDate).getTime();
      }
    } else {
      pre.start = new Date(cur.item.planDate).getTime();
    }

    if (pre.end) {
      if (new Date(cur.item.deadlineDate).getTime() > pre.end) {
        pre.end = new Date(cur.item.deadlineDate).getTime();
      }
    } else {
      pre.end = new Date(cur.item.deadlineDate).getTime();
    }
    return pre;
  }, { start: 0, end: 0 });
  totalDate.value = getDays(new Date(obj.end), new Date(obj.start)) + 1;
  planViewList.value = props.planItemList.map(item => ({
    id: item.item.id,
    name: item.item.name,
    start: getDays(new Date(item.item.planDate), new Date(obj.start)),
    end: getDays(new Date(item.item.deadlineDate), new Date(obj.start))
  }));
});
</script>

<style scoped lang="scss">
.table-container {
  width: max-content;
  margin: 0 auto;
}

.table-header {
  display: flex;
}

.progress-line {
  display: flex;
  margin-bottom: 12px;

  .progress-item-title {
    width: 50px;
    height: 28px;
    line-height: 28px;
    text-align: left;
    position: relative;
    &:after {
      position: absolute;
      content: '';
      left: 0;
      bottom: 0;

    }
  }

  .progress-item {
    width: 50px;
    height: 12px;
    //border-bottom: 1px solid #CCC;
    //border-right: 1px solid #ccc;;
  }

  .active-progress-item {
    background: #2ea44f;
  }
  .active-progress-item-left {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  .active-progress-item-right {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
}
</style>

<template>
  <div class="table-container">
    <div
      class="progress-container"
      ref="tableContainer"
      @mouseenter="isShow = true"
      @mouseleave="isShow = false">
      <div v-if="isShow" class="line-style" :style="{left: linePosition.left + 'px'}"></div>
      <div v-if="isShow" class="line-1-style" :style="{
        top: linePosition.top + 'px'
      }"></div>
      <div
        class="progress-content"
        :style="{
          height: (planViewList.length * 32) + 'px'
        }"
        @mouseover="handleMouseenter"
        @mouseout="handleMouseOut">
        <div></div>
        <div
          v-for="(item, index) in planViewList"
          :key="index"
          class="progress-line"
          :style="{
            top: (index * 32) + 'px',
            left: item.position.left + 'px',
            width: item.position.width + 'px'
          }">
          {{ item.start }} {{ item.end }}
        </div>
      </div>
    </div>
    <div class="progress-bottom-line">
      <div
        v-for="(item, index) in totalDate"
        :key="index"
        :style="{
          width: unitWidth + 'px'
        }"
        :class="['progress-item-title']">
        <div class="date-title">2022-12-21</div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { throttle } from 'lodash';
import { defineProps, PropType, ref, watchEffect } from 'vue';
import { EntityCompletelyListItemType, PlanItemModelType } from '@metagraph/constant';

const isShow = ref(false);
const tableContainer = ref<HTMLElement>();
const linePosition = ref({
  left: 0,
  top: 0
});

const panelStyle = ref({
  minWidth: 0
});
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

const planViewList = ref<{
  id: string;
  name: string;
  start: number;
  end: number;
  realStart?: number;
  realEnd?: number;
  status: 'todo' | 'doing' | 'done';
  position: {
    left: number;
    width: number;
  }
}[]>([]);

function handleMouseenter(event: MouseEvent) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  const elementX = tableContainer.value?.getBoundingClientRect().x ?? 0;
  const elementY = tableContainer.value?.getBoundingClientRect().y ?? 0;
  linePosition.value.left = mouseX - elementX;
  linePosition.value.top = mouseY - elementY;
}

function handleMouseOut(event: MouseEvent) {
  console.log('out');
}

const handleEvent = throttle(handleMouseenter, 0);

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

const unitWidth = ref(0);
const totalDate = ref(20);
const todayIndex = ref();
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
  console.log(totalDate.value, '-----total date');
  unitWidth.value = parseInt((800 / totalDate.value).toFixed(0), 10);
  console.log(`${unitWidth.value}----- unit width`);
  todayIndex.value = getDays(new Date(), new Date(obj.start));
  planViewList.value = props.planItemList.map(item => {
    // 未开始 进行中 已完成
    const startIndex = getDays(new Date(item.item.planDate), new Date(obj.start));
    const endIndex = getDays(new Date(item.item.deadlineDate), new Date(obj.start));
    return {
      id: item.item.id,
      name: item.item.name,
      start: startIndex,
      end: endIndex,
      status: item.item.status,
      realStart: 2,
      realEnd: 10,
      position: {
        left: startIndex * unitWidth.value,
        width: (endIndex - startIndex + 1) * unitWidth.value
      }
    };
  });
});
</script>

<style scoped lang="scss">
.table-container {
  width: 840px;
  padding: 20px 20px 50px;
  margin: 0 auto;

  .progress-container {
    position: relative;
    height: 100%;
    padding: 10px 0;
    min-width: 800px;
    width: 100%;

    .line-style {
      position: absolute;
      top: 0;
      height: 100%;
      width: 1px;
      //background: #0D0D0D;
      background-image: linear-gradient(#000 35%, rgba(255, 255, 255, 0) 0%); /* 35%设置虚线点y轴上的长度 */
      background-position: left; /* right配置右边框位置的虚线 */
      background-size: 1px 10px; /* 第一个参数设置虚线点x轴上的长度；第二个参数设置虚线点的间距 */
      background-repeat: repeat-y;
    }

    .line-1-style {
      position: absolute;
      left: 0;
      width: 100%;
      height: 1px;
      /* 35%设置虚线点x轴上的长度 */
      background-image: linear-gradient(to right, #000 35%, rgba(255, 255, 255, 0) 0%);
      background-position: bottom; /* top配置上边框位置的虚线 */
      background-size: 10px 1px; /* 第一个参数设置虚线点的间距；第二个参数设置虚线点y轴上的长度 */
      background-repeat: repeat-x;
    }

    .progress-content {
      height: 100%;
      width: 100%;
      position: relative;

      .progress-line {
        position: absolute;
        height: 18px;
        background: #2ea44f;
        display: flex;
        margin-bottom: 24px;
        border-radius: 9px;

        .active-item {
          background: #2ea44f;
        }

        .active-progress-item {
          background: #2ea44f;
        }
      }
    }
  }

  .progress-bottom-line {
    display: flex;
    margin-bottom: 12px;
    width: 100%;

    .progress-item-title {
      height: 28px;
      line-height: 28px;
      text-align: center;
      position: relative;

      .date-title {
        font-size: 12px;
        width: max-content;
        position: absolute;
        top: 16px;
        left: -10px;
        transform: rotate(45deg);
      }

      &:after {
        position: absolute;
        content: '';
        left: 0;
        top: -4px;
        height: 4px;
        width: 1px;
        background: #0D0D0D;
      }

      &:before {
        position: absolute;
        content: '';
        right: 0;
        top: 0;
        height: 1px;
        width: 100%;
        background: #0D0D0D;
      }
    }
  }
}


</style>

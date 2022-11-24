<template>
  <div class="table-container">
    <div class="progress-line table-header">
      <div v-for="(item, index) in totalDate" class="progress-item">{{ index + 1 }}</div>
    </div>

    <div v-for="(item, index) in planItemList" class="progress-line">
      <div
        v-for="(innerItem, innerIndex) in totalDate"
        :key="innerIndex"
        :class="{'active-progress-item': innerIndex + 1 >= item.start && innerIndex + 1 <= item.end}"
        class="progress-item"></div>
    </div>
  </div>

</template>

<script lang="ts" setup>
function getDays(date1: string, date2: string) {
  const date1Str = date1.split('-').map((item) => Number(item));// 将日期字符串分隔为数组,数组元素分别为年.月.日
  // 根据年 . 月 . 日的值创建Date对象
  const date1Obj = new Date(date1Str[0], (date1Str[1] - 1), date1Str[2]);
  const date2Str = date2.split('-').map((item) => Number(item));
  const date2Obj = new Date(date2Str[0], (date2Str[1] - 1), date2Str[2]);
  const t1 = date1Obj.getTime();
  const t2 = date2Obj.getTime();
  const dateTime = 1000 * 60 * 60 * 24; // 每一天的毫秒数
  const minusDays = Math.floor(((t2 - t1) / dateTime));// 计算出两个日期的天数差
  // 取绝对值
  return Math.abs(minusDays);
}

const startDate = new Date('2022-11-15');
const endDate = new Date('2022-12-15');
console.log(getDays('2022-11-15', '2022-12-15'));
console.log(getDays('2022-11-15', '2022-12-15'));
const totalDate = 20;
const planItemList = [{
  id: 1, name: '1', start: 2, end: 10
}, {
  id: 1, name: '1', start: 1, end: 3
}, {
  id: 1, name: '1', start: 5, end: 6
}, {
  id: 1, name: '1', start: 12, end: 18
}];
</script>

<style scoped lang="scss">
.table-container {
  width: max-content;
  margin: 0 auto;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}

.table-header {
  display: flex;
}

.progress-line {
  display: flex;

  .progress-item {
    width: 100px;
    height: 20px;
    border-bottom: 1px solid #CCC;
    border-right: 1px solid #ccc;;
  }

  .active-progress-item {
    background: #2ea44f;
  }
}
</style>

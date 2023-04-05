<template>
  <span v-if="time">{{ time }}</span>
  <LoadingOutlined v-else/>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue';
import { LoadingOutlined } from '@ant-design/icons-vue';

const emit = defineEmits(['timeEnd']);
const props = defineProps({
  endTime: {
    type: Number
  }
});
const time = ref('');
const flag = ref(false);

function format(time: number) {
  if (time >= 10) {
    return time;
  }
  return `0${ time }`;
}

function timeDown() {
  const endTime = new Date(props.endTime as number);
  const nowTime = new Date();
  const leftTime = parseInt(((endTime.getTime() - nowTime.getTime()) / 1000).toString(), 10);
  const d = parseInt((leftTime / (24 * 60 * 60)).toString(), 10);
  const h = format(parseInt(((leftTime / (60 * 60)) % 24).toString(), 10));
  const m = format(parseInt(((leftTime / 60) % 60).toString(), 10));
  const s = format(parseInt((leftTime % 60).toString(), 10));
  if (leftTime <= 0) {
    flag.value = true;
    emit('timeEnd');
  }
  time.value = `${ s }秒`;
  // this.time = `${h}:${m}:${s}`; // 需要修改时间样式的话 ，比如需要什么30分钟倒计时，就只保留分和秒
}

onMounted(() => {
  const time = setInterval(() => {
    if (flag.value === true) {
      clearInterval(time);
    }
    timeDown();
  }, 200);
});

</script>

<style scoped>
</style>

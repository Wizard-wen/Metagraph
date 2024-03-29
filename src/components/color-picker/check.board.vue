<template>
  <div class="checkerboard" :style="bgStyle"></div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

const checkBoardCache: {[key: string]: string | undefined} = {};

const renderCheckBoard = (white: string, grey: string, size: number): string | undefined => {
  const canvas = document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext('2d');

  if (!ctx) return undefined;

  ctx.fillStyle = white;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = grey;
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size, size);
  ctx.fillRect(0, 0, size, size);
  return canvas.toDataURL();
};

const getCheckBoard = (white: string, grey: string, size: number): string | undefined => {
  const key = `${white},${grey},${size}`;
  if (checkBoardCache[key]) return checkBoardCache[key];

  const checkBoard = renderCheckBoard(white, grey, size);
  checkBoardCache[key] = checkBoard;
  return checkBoard;
};

export default defineComponent({
  name: 'checkboard',
  props: {
    size: {
      type: Number,
      default: 8,
    },
    white: {
      type: String,
      default: '#fff',
    },
    grey: {
      type: String,
      default: '#e6e6e6',
    },
  },
  setup(props) {
    const bgStyle = computed(() => {
      const checkBoard = getCheckBoard(props.white, props.grey, props.size);
      return { backgroundImage: `url(${checkBoard})` };
    });
    return {
      bgStyle,
    };
  },
});
</script>

<style lang="scss" scoped>
.checkerboard {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: contain;
}
</style>

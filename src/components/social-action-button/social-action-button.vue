<template>
  <div class="action-button">
    <div class="action" @click="handleAction">
      <slot name="icon"></slot>
      <div class="title">{{ title }}</div>
    </div>
    <div class="total" @click="handleTotalClick">{{ total }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'social-action-button',
  props: {
    title: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  emits: ['action', 'total'],
  setup(props, { emit }) {
    const handleAction = () => {
      emit('action');
    };
    const handleTotalClick = () => {
      emit('total');
    };
    return {
      handleAction, handleTotalClick
    };
  }
});
</script>

<style scoped lang="scss">
@import "../../style/common.scss";
.action-button {
  &:hover {
    cursor: pointer;
  }

  height: 28px;
  width: max-content;
  display: flex;
  align-items: center;
  background: rgb(246, 248, 250);
  font-weight: 500;

  .action {
    height: 28px;
    padding: 0 8px;
    display: flex;
    gap: 5px;
    align-items: center;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border: 1px solid $borderColor;

  }

  .total {
    height: 28px;
    padding: 0 8px;
    line-height: 28px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border: 1px solid $borderColor;
  }
}

</style>

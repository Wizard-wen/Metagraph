<template>
  <div class="card-item">
    <section class="widget">
      {{ planItem.name }}
    </section>
  </div>
</template>

<script lang="ts">
import { PlanModelType } from 'metagraph-constant';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'plan-item-card',
  props: {
    planItem: {
      type: Object as PropType<PlanModelType>,
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
.card-item {
  margin: 8px 0 8px 16px;
  width: 232px;

  .widget {
    background: linear-gradient(180deg, hsla(0, 0%, 100%, .8) 0, hsla(0, 0%, 100%, .9));
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 0;
    height: 70px;
    text-align: left;
  }
}
</style>

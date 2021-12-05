<template>
  <div
    :class="{'character-count': true, 'character-count--warning': current === limit}">
<!--    <svg height="20" width="20" viewBox="0 0 20 20" class="character-count__graph">-->
<!--      <circle r="10" cx="10" cy="10" fill="#e9ecef"/>-->
<!--      <circle-->
<!--        r="5" cx="10" cy="10" fill="transparent"-->
<!--        stroke="currentColor" stroke-width="10"-->
<!--        :stroke-dasharray="`calc(${percentage} * 31.4 / 100) 31.4`"-->
<!--        transform="rotate(-90) translate(-20)"/>-->
<!--      <circle r="6" cx="10" cy="10" fill="white"/>-->
<!--    </svg>-->
    <div class="character-count__text">
      {{ current }} 个字
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

export default defineComponent({
  name: 'article.limit',
  props: {
    limit: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const { limit, current } = toRefs(props);
    const percentage = computed(() => Math.round((100 / limit.value) * current.value));
    return {
      percentage
    };
  }
});
</script>

<style scoped lang="scss">
.character-count {
  display: flex;
  align-items: center;
  color: #0969DC;

  &--warning {
    color: #FB5151;
  }

  &__graph {
    margin-right: 0.5rem;
  }

  &__text {
    color: #868e96;
  }
}
</style>

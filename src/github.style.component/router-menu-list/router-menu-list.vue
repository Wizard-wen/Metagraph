<template>
  <div class="menu-list">
    <div class="title">{{ title }}</div>
    <router-link
      v-for="(item, index) in routerList"
      :key="index"
      @click="handleMenuClick(item, index)"
      :class="{
        'list-item-without-border': index === routerList.length - 1,
        'list-item-active': index === activeIndex
      }"
      :to="item.path"
      class="list-item">{{ item.name }}
    </router-link>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, PropType, ref, toRef
} from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'router-menu-list',
  props: {
    title: {
      type: String,
      default: 'title',
      required: true
    },
    type: {
      type: String as PropType<'router' | 'normal'>,
      default: 'router'
    },
    navList: {
      type: Array as PropType<{ path: string; name: string }[]>,
      required: true,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const routerList = toRef(props, 'navList');
    const route = useRoute();
    const activeIndex = ref(0);
    const handleMenuClick = (item: { path: string; name: string }, index: number) => {
      activeIndex.value = index;
      emit('onClickItem', item);
    };
    onMounted(() => {
      activeIndex.value = routerList.value.findIndex((item) => item.path === route.path);
    });
    return {
      routerList,
      activeIndex,
      handleMenuClick
    };
  }
});
</script>

<style scoped lang="scss">
@import "../../style/common";

.menu-list {
  margin-right: 24px;
  border: 1px solid $borderColor;
  border-radius: 6px;
  text-align: left;

  .title {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom: 1px solid $borderColor;
    padding: 8px 16px;
    margin-top: 0;
    margin-bottom: 0;
    font-size: inherit;
    font-weight: 600;
  }

  .list-item {
    position: relative;
    border-bottom: 1px solid $borderColor;
    display: block;
    padding: 8px 16px;
    color: $fontColor;
  }

  .list-item-without-border {
    border-bottom: none;
  }

  .list-item-active {
    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 2px;
      content: "";
      background: rgb(253, 140, 115);
    }
  }
}
</style>

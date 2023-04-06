<template>
  <div class="menu-list">
    <div class="title">{{ title }}</div>
    <template v-if="type === 'router'">
      <router-link
        v-for="(item, index) in navList"
        :key="index"
        @click="handleRouterChange(item, index)"
        :class="{
        'list-item-without-border': index === navList.length - 1,
        'list-item-active': index === activePathIndex
      }"
        :to="item.value"
        class="list-item">{{ item.name }}
      </router-link>
    </template>
    <template v-else>
      <div
        v-for="(item, index) in navList"
        :key="index"
        @click="handleMenuClick(item, index)"
        :class="{
        'list-item-without-border': index === navList.length - 1,
        'list-item-active': index === activeIndex
      }"
        class="list-item">{{ item.name }}
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    default: 'title',
    required: true
  },
  activeId: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<'router' | 'normal'>,
    default: 'router'
  },
  navList: {
    type: Array as PropType<{ name: string; value: string }[]>,
    required: true,
    default: () => []
  }
});
const emit = defineEmits(['onClickItem']);

const route = useRoute();
const activeIndex = computed(
  () => props.navList?.findIndex((item) => item.value === props.activeId)
);
const handleMenuClick = (item: {
  name: string;
  value: string
}, index: number) => {
  emit('onClickItem', { ...item, index });
};

const activePathIndex = ref(0);

function handleRouterChange(item: {
  name: string;
  value: string
}, index: number) {
  activePathIndex.value = index;
  emit('onClickItem', { ...item, index });
}

onMounted(() => {
  if (props.type === 'router') {
    activePathIndex.value = props.navList.findIndex((item) => item.value === route.path);
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
    cursor: pointer;
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
      background: $themeColor;
    }
  }
}
</style>

<template>
  <div
    class="mask"
    @contextmenu.prevent="removeContextmenu()"
    @mousedown="removeContextmenu()"></div>
  <div
    class="contextmenu"
    :style="{
      left: `${contextmenuPosition.left}px`,
      top: `${contextmenuPosition.top}px`,
    }"
    @contextmenu.prevent>
    <MenuContent
      :menuList="menuList"
      :handleClickMenuItem="handleClickMenuItem"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ContextmenuItem, Axis } from './types';
import MenuContent from './MenuContent.vue';
import { MenuStyleEnum } from './constant';

export default defineComponent({
  name: 'contextmenu',
  components: {
    MenuContent,
  },
  props: {
    axis: {
      type: Object as PropType<Axis>,
      required: true,
    },
    element: {
      type: Object as PropType<HTMLElement>,
      required: true,
    },
    menuList: {
      type: Array as PropType<ContextmenuItem[]>,
      required: true,
    },
    removeContextmenu: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const contextmenuPosition = computed(() => {
      const { x, y } = props.axis;
      console.log(props.axis, props.menuList);
      const menuCount = props.menuList.filter((menu) => !(menu.divider || menu.hide)).length;
      const dividerCount = props.menuList.filter((menu) => menu.divider).length;
      const menuWidth = MenuStyleEnum.MENU_WIDTH;
      const menuHeight = menuCount * MenuStyleEnum.MENU_HEIGHT
        + dividerCount * MenuStyleEnum.DIVIDER_HEIGHT
        + MenuStyleEnum.PADDING * 2;
      const screenWidth = document.body.clientWidth;
      const screenHeight = document.body.clientHeight;
      console.log(menuWidth, menuHeight, screenWidth, screenHeight);
      return {
        left: screenWidth <= x + menuWidth ? x - menuWidth : x,
        top: screenHeight <= y + menuHeight ? y - menuHeight : y,
      };
    });
    const handleClickMenuItem = (item: ContextmenuItem) => {
      if (item.disable || item.children) return;
      if (item.handler) item.handler(props.element);
      props.removeContextmenu();
    };
    return {
      contextmenuPosition,
      handleClickMenuItem,
    };
  },
});
</script>

<style lang="scss">
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
}

.contextmenu {
  position: fixed;
  z-index: 9999;
  user-select: none;
}
</style>

<template>
  <ul class="menu-content">
    <template v-for="(menu, index) in menuList" :key="menu.text || index">
      <li
        v-if="!menu.hide"
        class="menu-item"
        @click.stop="handleClickMenuItem(menu)"
        :class="{'divider': menu.divider, 'disable': menu.disable}">
        <div class="menu-item-content"
             :class="{'has-children': menu.children}"
             v-if="!menu.divider">
          <span class="text">{{menu.text}}</span>
          <span class="sub-text" v-if="menu.subText && !menu.children">{{menu.subText}}</span>
          <menu-content
            class="sub-menu"
            :menuList="menu.children"
            v-if="menu.children && menu.children.length"
            :handleClickMenuItem="handleClickMenuItem"/>
        </div>
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { ContextmenuItem } from './types';

export default defineComponent({
  name: 'menu-content',
  props: {
    menuList: {
      type: Array as PropType<ContextmenuItem[]>,
      required: true,
    },
    handleClickMenuItem: {
      type: Function,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../style/common.scss';
$menuWidth: 170px;
$menuHeight: 30px;
$subMenuWidth: 120px;

.menu-content {
  width: $menuWidth;
  padding: 5px 0;
  background: #fff;
  border: 1px solid $borderColor;
  box-shadow: $boxShadow;
  border-radius: 2px;
  list-style: none;
  margin: 0;
  .menu-item {
    padding: 0 20px;
    color: #555;
    font-size: 12px;
    transition: all .1s;
    white-space: nowrap;
    height: $menuHeight;
    line-height: $menuHeight;
    background-color: #fff;
    cursor: pointer;

    &:not(.disable):hover > .menu-item-content > .sub-menu {
      display: block;
    }

    &:hover:not(.disable) {
      background-color: rgba($color: $themeColor, $alpha: .2);
    }

    &.divider {
      height: 1px;
      overflow: hidden;
      margin: 5px;
      background-color: #e5e5e5;
      line-height: 0;
      padding: 0;
    }

    &.disable {
      color: #b1b1b1;
      cursor: no-drop;
    }
    .menu-item-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      &.has-children::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-width: 1px;
        border-style: solid;
        border-color: #666 #666 transparent transparent;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }
      .sub-text {
        opacity: 0.6;
      }
      .sub-menu {
        min-width: $subMenuWidth;
        position: absolute;
        display: none;
        left: 112%;
        top: -6px;
      }
    }
  }
}
</style>

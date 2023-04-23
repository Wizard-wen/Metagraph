<template>
  <div class="search-bar">
    <SearchOutlined class="search-icon"/>
    <input type="text" class="search-input" placeholder="搜索实体">
    <m-button :size="'small'" :has-border="false"  @click="bindEntity">
      <template #icon>
        <PlusOutlined/>
      </template>
    </m-button>
  </div>
  <ant-list class="custom-ant-list" :dataSource="planBindEntityList">
    <template #renderItem="{ item }">
      <ant-list-item style="padding: 7px 0">
        <div class="custom-list-item">
          <LockOutlined v-if="item.planEntityModel.isInnerPlanItem"/>
          <UnlockOutlined v-else/>
          {{ item.entity.content.name }}
        </div>
        <template #actions v-if="!item.planEntityModel.isInnerPlanItem">
          <a @click="unbindEntityFromPlan(item.entity.entity.id)">解绑</a>
        </template>
      </ant-list-item>
    </template>
  </ant-list>
</template>

<script lang="ts" setup>
import { List as AntList } from 'ant-design-vue';
import { defineEmits } from 'vue';
import {
  ControlOutlined,
  LockOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UnlockOutlined
} from '@ant-design/icons-vue';
import { MButton } from '@/metagraph-ui';
import { planBindEntityList } from '../plan.board';

const AntListItem = AntList.Item;
const emit = defineEmits(['unbind', 'bind']);


function unbindEntityFromPlan(id: string) {
  emit('unbind', { id });
}

function bindEntity() {

}
</script>

<style scoped lang="scss">
@import "../../../../style/common.scss";

.search-bar {
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $borderColor;

  .search-icon {
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .search-input {
    display: block;
    height: 32px;
    flex: 1;
    border: none;
    outline: none;
    font-size: 12px;
  }
}
</style>

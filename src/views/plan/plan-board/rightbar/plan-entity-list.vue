<template>
  <ant-list class="custom-ant-list" :dataSource="planBindEntityList">
    <template #header>
      <div class="entity-list-header">
        <span>实体列表</span>
        <PlusCircleOutlined style="font-size: 16px;" @click="bindEntity"/>
      </div>
    </template>
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
  LockOutlined,
  UnlockOutlined,
  PlusCircleOutlined
} from '@ant-design/icons-vue';
import {
  planBindEntityList
} from '../plan.board';
const AntListItem = AntList.Item;
const emit = defineEmits(['unbind']);


function unbindEntityFromPlan(id: string) {
  emit('unbind', { id });
}

function bindEntity() {

}
</script>

<style scoped lang="scss">

</style>

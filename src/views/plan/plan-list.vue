<template>
  <div class="plan-list-page">
    <div class="plan-list-title">
      个人计划
    </div>
    <div class="plan-list-header">
      <ant-button type="primary" @click="openCreateModal()">创建</ant-button>
    </div>
    <ant-list :grid="{ gutter: 16, column: 4 }" :data-source="plan.list">
      <template #renderItem="{ item }">
        <ant-list-item>
          <ant-badge style="display: block" :dot="!!item.status" :color="item.statusColor">
            <ant-card :title="item.name" class="custom-plan-card">
              <ant-card-meta>
                <template #description>
                  <div class="card-description-item">计划日期: {{ item.planDate }}</div>
                  <div class="card-description-item">截止日期: {{ item.deadlineDate }}</div>
                </template>
              </ant-card-meta>
              <template class="ant-card-actions" #actions>
                <setting-outlined key="setting" @click="openCreateModal(item.id)"/>
                <edit-outlined key="edit" @click="goPlanBoard(item.id)"/>
                <ellipsis-outlined key="ellipsis"/>
              </template>
            </ant-card>
          </ant-badge>
        </ant-list-item>
      </template>
    </ant-list>
  </div>

  <plan-edit-modal
    v-if="isPlanEditModalShown"
    :plan-id="planId"
    :is-modal-visible="isPlanEditModalShown"
    @close="handleCloseModal"></plan-edit-modal>
</template>

<script lang="ts">
import PlanEditModal from '@/views/plan/plan-edit-modal.vue';
// import PlanItemCard from '@/views/plan/plan-item-card.vue';
import {
  List, Card, Button, Space, Badge
} from 'ant-design-vue';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { PlanList, plan } from '@/views/plan/plan.list';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'plan-list',
  components: {
    // PlanItemCard,
    PlanEditModal,
    AntSpace: Space,
    AntBadge: Badge,
    AntList: List,
    AntListItem: List.Item,
    AntCard: Card,
    AntCardMeta: Card.Meta,
    AntButton: Button,
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
  },
  setup() {
    const planList = new PlanList();
    const router = useRouter();
    const isPlanEditModalShown = ref(false);
    const planId = ref();
    onMounted(async () => {
      await planList.getPlanList();
    });

    function openCreateModal(id?: string) {
      console.log(id);
      isPlanEditModalShown.value = true;
      if (id) {
        planId.value = id;
      }
    }

    async function handleCloseModal() {
      isPlanEditModalShown.value = false;
      await planList.getPlanList();
    }

    async function goPlanBoard(id: string) {
      router.push({
        path: '/planBoard',
        query: {
          id
        }
      }).then();
    }

    return {
      plan,
      planId,
      openCreateModal,
      isPlanEditModalShown,
      handleCloseModal,
      goPlanBoard
    };
  }
});
</script>

<style scoped lang="scss">

.plan-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 0;

  .plan-list-title {
    line-height: 50px;
    font-size: 18px;
    font-weight: bold;
    text-align: left;
  }

  .plan-list-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  .custom-plan-card {
    &::v-deep(.custom-ant-button) {
      padding: 0;
      font-size: 12px;
    }

    &::v-deep(.ant-card-head-title) {
      text-align: left;
      padding: 5px 0;
      font-size: 16px;
      line-height: 35px;
    }

    &::v-deep(.ant-card-extra) {
      padding: 5px 0;
    }

    &::v-deep(.ant-card-body) {
      padding: 20px 10px;
    }

    &::v-deep(.ant-card-head) {
      padding: 0 16px;
    }

    .card-description-item {
      text-align: left;
      line-height: 30px;
    }
  }
}
</style>

<template>
  <div class="plan-list-page">
    <div class="plan-list-header">
      <ant-button type="primary" @click="openCreateModal()">创建</ant-button>
    </div>
    <ant-list :grid="{ gutter: 16, column: 4 }" :data-source="plan.list">
      <template #renderItem="{ item }">
        <ant-list-item>
          <ant-card :title="item.name" class="custom-plan-card">
            <template #extra>
              <ant-space>
                <ant-button
                  class="custom-ant-button"
                  @click="openCreateModal(item.id)"
                  type="text">编辑
                </ant-button>
                <ant-button
                  class="custom-ant-button"
                  @click="goPlanBoard(item.id)"
                  type="text">进入
                </ant-button>
              </ant-space>
            </template>
            {{ item.deadlineDate }}
            <template class="ant-card-actions" #actions>
              <setting-outlined key="setting" />
              <edit-outlined key="edit" />
              <ellipsis-outlined key="ellipsis" />
            </template>
          </ant-card>
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
  List, Card, Button, Space
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
    AntList: List,
    AntListItem: List.Item,
    AntCard: Card,
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
      await router.push({
        path: '/planBoard',
        query: {
          id
        }
      });
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

    &::v-deep(.ant-card-head) {
      padding: 0 16px;
    }
  }
}
</style>

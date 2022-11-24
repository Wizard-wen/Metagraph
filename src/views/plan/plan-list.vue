<template>
  <div class="plan-list-page">
    <div class="plan-list-title">
      个人计划
    </div>
    <div class="plan-list-header">
      <ant-button type="primary" @click="openCreateModal()">创建</ant-button>
    </div>
    <div class="card-list-content">
      <plan-item-card
        @clickTitle="goPlanBoard"
        @edit="openCreateModal"
        v-for="(item, index) in plan.list"
        :key="index"
        :plan-item="item"></plan-item-card>
    </div>
    <div class="pagination-box">
      <ant-pagination
        class="pagination"
        :pageSize="planFilterObject.pageSize"
        v-model:current="planFilterObject.pageNumber"
        :total="plan.total"
        @change="onPageChange"/>
    </div>
  </div>
  <plan-edit-modal
    v-if="isPlanEditModalShown"
    :plan-id="planId"
    :is-modal-visible="isPlanEditModalShown"
    @close="handleCloseModal"></plan-edit-modal>
</template>

<script lang="ts" setup>
import PlanEditModal from '@/views/plan/plan-edit-modal.vue';
import PlanItemCard from '@/views/plan/plan-item-card.vue';
import { Button as AntButton, Pagination as AntPagination } from 'ant-design-vue';
import { plan, planFilterObject, PlanList } from '@/views/plan/plan.list';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const planList = new PlanList();
const router = useRouter();
const isPlanEditModalShown = ref(false);
const planId = ref();
onMounted(async () => {
  await planList.getPlanList();
});

function onPageChange() {
  // todo
}

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

  .card-list-content {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .pagination-box {
    display: flex;
    justify-content: center;
    padding: 40px;
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

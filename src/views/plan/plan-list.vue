<template>
  <div class="plan-list-page">
    <div class="plan-list-header">
      <div class="plan-list-title">
        个人计划
      </div>
      <ant-button type="primary" @click="openCreateModal()">创建</ant-button>
    </div>
    <template v-if="isLoading">
      <ant-skeleton v-for="item in 3" :key="item"></ant-skeleton>
    </template>
    <template v-else>
      <div class="card-list-content" v-if="plan.list.length">
        <plan-item-card
          @clickTitle="goPlanBoard"
          @edit="openCreateModal"
          v-for="(item, index) in plan.list"
          :key="index"
          :plan-item="item"></plan-item-card>
      </div>
      <empty-view v-else></empty-view>
    </template>
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
import {
  Button as AntButton,
  Pagination as AntPagination,
  Skeleton as AntSkeleton
} from 'ant-design-vue';
import { plan, planFilterObject, PlanList } from '@/views/plan/plan.list';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { EmptyView } from '@/components';

const planList = new PlanList();
const router = useRouter();
const isPlanEditModalShown = ref(false);
const planId = ref();
const isLoading = ref(false);
onMounted(async () => {
  isLoading.value = true;
  await planList.getPlanList();
  isLoading.value = false;
});

function onPageChange() {
  // todo
}

function openCreateModal(id?: string) {
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
    path: '/plan/board',
    query: {
      id
    }
  }).then();
}
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.plan-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 0;

  .plan-list-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    border-bottom: 1px solid $borderColor;

    .plan-list-title {
      line-height: 50px;
      font-size: 18px;
      font-weight: bold;
      text-align: left;
    }
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

<template>
  <ant-modal
    style="position: relative"
    :width="600"
    :title="'新建知识点'"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <will-select-repository-list
      @control="handleControl"
      :active-id="selectedRepositoryEntityId"
      :is-editable="true"
      :list-data="ownRepositoryList"></will-select-repository-list>
  </ant-modal>
</template>

<script lang="ts" setup>
import { message, Modal as AntModal } from 'ant-design-vue';
import { defineEmits, defineProps, onMounted, ref } from 'vue';
import { RepositoryApiService } from '@/api-service';
import WillSelectRepositoryList
  from '@/views/main/metagraph-header/will-select-repository-list.vue';

defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
});
const emit = defineEmits(['close']);

const modalConfirmLoading = ref(false);
const ownRepositoryList = ref();
const selectedRepositoryEntityId = ref();

function handleModalOk() {

}

function handleControl(params: { id: string }) {
  selectedRepositoryEntityId.value = params.id;
}

function handleModalCancel() {
  emit('close');
}

async function getOwnRepositoryList(): Promise<void> {
  const result = await RepositoryApiService.getOwnRepositoryList();
  if (result.data) {
    ownRepositoryList.value = result.data;
  } else {
    message.error('获取知识库数据时失败！');
  }
}

onMounted(async () => {
  await getOwnRepositoryList();
});

</script>

<style scoped lang="scss">

</style>

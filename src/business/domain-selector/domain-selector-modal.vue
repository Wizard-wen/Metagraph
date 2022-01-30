<template>
  <ant-modal
    :width="800"
    title="修改领域"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="5"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-spin :spinning="isLoading">
      <div class="domain-tag-list" v-if="domainList.length">
        <ant-tag
          closable
          @close="handleDeleteDomainTag(index)"
          v-for="(item, index) in domainList">
          {{ item.domainName || '-' }}
        </ant-tag>
      </div>
      <div class="domain-form-box">
        <ant-select
          style="width: 120px;"
          @change="handleDomainBaseTypeChange"
          v-model:value="domainBaseTypeId"
          placeholder="请选择领域类型">
          <ant-select-option
            v-for="item in enabledDomainList"
            :value="item.id">{{ item.name }}
          </ant-select-option>
        </ant-select>
        <ant-cascader
          :fieldNames="fieldNames"
          :disabled="domainTree.target.length === 0"
          v-model:value="domainIdList.target"
          :options="domainTree.target" placeholder="请选择领域"/>
        <ant-button v-if="domainIdList.target.length" @click="addDomain()">添加</ant-button>
      </div>
    </ant-spin>
  </ant-modal>
</template>

<script lang="ts">
import { Cascader } from 'ant-design-vue';
import {
  defineComponent, onMounted, PropType, ref, toRef, computed
} from 'vue';
import {
  domain,
  domainBaseTypeId, domainBaseTypeList,
  domainIdList,
  domainList,
  DomainSelector, domainTree
} from '@/business/domain-selector/domain.selector';

export default defineComponent({
  name: 'domain-select-modal',
  components: {
    AntCascader: Cascader
  },
  emits: ['close'],
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    domainList: {
      type: Array as PropType<{
        domainId: string[];
        domainName?: string,
        domainBaseTypeId: string;
      }[]>,
      required: true
    }
  },
  setup(props, { emit }) {
    const modalConfirmLoading = ref(false);
    const initDomainList = toRef(props, 'domainList');
    domain.target = initDomainList.value;
    const isLoading = ref(false);
    const domainSelect = new DomainSelector();
    const fieldNames = {
      label: 'name',
      value: 'key',
      children: 'children'
    };

    const enabledDomainList = computed(() => domainBaseTypeList.target.filter(
      (item) => {
        const result = domain.target.find((domainItem) => domainItem.domainBaseTypeId === item.id);
        return !result;
      }
    ));

    function handleModalCancel() {
      emit('close', {
        domain: domain.target
      });
    }

    async function handleModalOk() {
      emit('close', {
        domain: domain.target
      });
    }

    function addDomain(): void {
      if (!domainBaseTypeId.value) {
        return;
      }
      domain.target.push({
        domainId: domainIdList.target,
        domainName: domainList.target.find((item) => item.id === domainIdList.target[2])?.name,
        domainBaseTypeId: domainBaseTypeId.value
      });
      domainIdList.target = [];
      domainBaseTypeId.value = '';
    }

    function handleDeleteDomainTag(index: number): void {
      domain.target.splice(index, 1);
    }

    async function handleDomainBaseTypeChange(event: any) {
      isLoading.value = true;
      await domainSelect.getDomainTree(event);
      isLoading.value = false;
    }

    onMounted(async () => {
      await domainSelect.getDomainBaseTypeList();
      if (domainBaseTypeId.value) {
        await domainSelect.getDomainTree(domainBaseTypeId.value);
      }
    });
    return {
      handleModalOk,
      handleModalCancel,
      modalConfirmLoading,
      fieldNames,
      domainBaseTypeId,
      enabledDomainList,
      domainIdList,
      domainTree,
      domainBaseTypeList,
      domain,
      handleDeleteDomainTag,
      addDomain,
      handleDomainBaseTypeChange,
      isLoading
    };
  }
});
</script>

<style scoped lang="scss">
.domain-tag-list {
  display: flex;
  justify-content: flex-start;
  gap: 15x;
  margin-bottom: 20px;
}

.domain-form-box {
  display: flex;
  gap: 20px;
}
</style>

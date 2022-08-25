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
      <div class="tag-title">
        已选择领域
      </div>
      <div class="domain-tag-list" v-if="domain.target.length">
        <ant-tag
          :visible="true"
          closable
          @close="handleDeleteDomainTag(index)"
          :key="index"
          v-for="(item, index) in domain.target">
          {{ item.domainName || '-' }}
        </ant-tag>
      </div>
      <ant-divider></ant-divider>
      <div class="domain-form-box">
        <ant-select
          style="width: 140px;"
          @change="handleDomainBaseTypeChange"
          v-model:value="domainBaseTypeId"
          placeholder="请选择领域类型">
          <ant-select-option
            :key="index"
            v-for="(item, index) in enabledDomainList"
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
import {
  Button, Cascader, Modal, Select, Spin, Tag, Divider
} from 'ant-design-vue';
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
    AntCascader: Cascader,
    AntSpin: Spin,
    AntButton: Button,
    AntSelect: Select,
    AntSelectOption: Select.Option,
    AntTag: Tag,
    AntModal: Modal,
    AntDivider: Divider
  },
  emits: ['close'],
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    selectedDomainList: {
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
    const initDomainList = toRef(props, 'selectedDomainList');
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

    async function handleDomainBaseTypeChange(event: string) {
      isLoading.value = true;
      await domainSelect.getDomainTree(event);
      isLoading.value = false;
    }

    async function addDomain(): Promise<void> {
      if (!domainBaseTypeId.value) {
        return;
      }
      domain.target.push({
        domainId: domainIdList.target,
        domainName: domainList.target.find((item) => item.id === domainIdList.target[2])?.name,
        domainBaseTypeId: domainBaseTypeId.value
      });
      domainIdList.target = [];
      domainBaseTypeId.value = enabledDomainList.value.length ? enabledDomainList.value[0].id : undefined;
      if (domainBaseTypeId.value) {
        await handleDomainBaseTypeChange(domainBaseTypeId.value);
      }
    }

    async function handleDeleteDomainTag(index: number): Promise<void> {
      domain.target.splice(index, 1);
      domainBaseTypeId.value = enabledDomainList.value.length ? enabledDomainList.value[0].id : undefined;
      if (domainBaseTypeId.value) {
        await handleDomainBaseTypeChange(domainBaseTypeId.value);
      }
    }

    onMounted(async () => {
      console.log(domainBaseTypeId.value);
      await domainSelect.getDomainBaseTypeList();
      domainBaseTypeId.value = enabledDomainList.value[0].id;
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
.tag-title {
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  font-weight: bold;
}

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

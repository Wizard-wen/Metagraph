<template>
  <div class="domain-tag-list" v-if="modelValue.length">
    <ant-tag
      closable
      @close="handleDeleteDomainTag(index)"
      :key="index"
      v-for="(item, index) in modelValue">{{ item.domainName || '-' }}
    </ant-tag>
  </div>
  <div class="domain-form-box">
    <ant-select
      style="max-width: 120px;"
      @change="handleDomainBaseTypeChange"
      v-model:value="domainBaseTypeId"
      placeholder="请选择领域类型">
      <ant-select-option
        :key="index"
        v-for="(item, index) in domainBaseTypeList.target"
        :value="item.id">{{ item.name }}
      </ant-select-option>
    </ant-select>
    <ant-cascader
      :fieldNames="fieldNames"
      v-model:value="domainIdList.target"
      :options="domainTree.target" placeholder="请选择领域"/>
    <ant-button v-if="domainIdList.target.length" @click="addDomain()">添加</ant-button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, PropType, toRef
} from 'vue';
import {
  Cascader, Select, Button, Tag
} from 'ant-design-vue';
import {
  domain, domainList, domainBaseTypeId, domainIdList, domainTree, domainBaseTypeList, DomainSelector
} from './domain.selector';

export default defineComponent({
  name: 'domain-select',
  components: {
    AntCascader: Cascader,
    AntSelect: Select,
    AntSelectOption: Select.Option,
    AntButton: Button,
    AntTag: Tag
  },
  props: {
    modelValue: {
      type: Array as PropType<{
        domainId: string[];
        domainBaseTypeId: string;
      }[]>,
      required: true
    },
    // 为了上层能够响应ant design form 需要在props中声明 value id
    value: String,
    id: String
  },
  emits: ['update:modelValue', 'change', 'blur'],
  setup(props, { emit }) {
    const initDomainList = toRef(props, 'modelValue');
    domain.target = initDomainList.value;
    const domainSelect = new DomainSelector();
    const fieldNames = {
      label: 'name',
      value: 'key',
      children: 'children'
    };

    function addDomain(): void {
      if (!domainBaseTypeId.value) {
        return;
      }
      domain.target.push({
        domainId: domainIdList.target,
        domainName: domainList.target.find((item) => item.id === domainIdList.target[2])?.name,
        domainBaseTypeId: domainBaseTypeId.value
      });
      emit('update:modelValue', domain.target);
      emit('change');
      domainIdList.target = [];
    }

    function handleDeleteDomainTag(index: number): void {
      domain.target.splice(index, 1);
      emit('update:modelValue', domain.target);
      emit('change');
    }

    async function handleDomainBaseTypeChange(event: any) {
      await domainSelect.getDomainTree(event);
    }

    onMounted(async () => {
      await domainSelect.getDomainBaseTypeList();
      if (domainBaseTypeId.value) {
        await domainSelect.getDomainTree(domainBaseTypeId.value);
      }
    });

    return {
      fieldNames,
      domainBaseTypeId,
      domainIdList,
      domainTree,
      domainBaseTypeList,
      domain,
      handleDeleteDomainTag,
      addDomain,
      handleDomainBaseTypeChange
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

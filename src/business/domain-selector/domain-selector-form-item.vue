<template>
  <div class="tag-box">
    <m-tag
      :key="index"
      v-for="(item, index) in modelValue"
      :title="item.domainName"></m-tag>
  </div>
  <m-button :title="'修改领域'" style="display: block" @click="handleOpenDomainModal">
    <template #icon>
      <EditOutlined/>
    </template>
  </m-button>
  <domain-select-modal
    v-if="isDomainModalVisible"
    :selected-domain-list="modelValue"
    :isModalVisible="isDomainModalVisible"
    @close="handleDomainModalClose($event)"></domain-select-modal>
</template>

<script lang="ts" setup>
import { domainBaseTypeId } from '@/business/domain-selector/domain.selector';
import { EditOutlined } from '@ant-design/icons-vue';
import { defineEmits, defineProps, PropType, ref } from 'vue';
import { MButton, MTag } from '@/metagraph-ui';
import DomainSelectModal from './domain-selector-modal.vue';

defineProps({
  modelValue: {
    type: Array as PropType<{
      domainId: string;
      domainName?: string;
      domainBaseTypeId: string;
    }[]>,
    required: true
  },
  // 为了上层能够响应ant design form 需要在props中声明 value id
  value: String,
  id: String
});

const emit = defineEmits(['update:modelValue', 'blur', 'change']);

const isDomainModalVisible = ref(false);
const domainListProp = ref<{
  domainId: string;
  domainName?: string;
  domainBaseTypeId: string;
}[]>();
const handleOpenDomainModal = () => {
  domainBaseTypeId.value = undefined;
  isDomainModalVisible.value = true;
};

async function handleDomainModalClose(event?: {
  domain: {
    domainId: string;
    domainName?: string;
    domainBaseTypeId: string;
  }[]
}) {
  isDomainModalVisible.value = false;
  if (event) {
    emit('update:modelValue', event.domain);
  }
}

</script>

<style scoped lang="scss">
.tag-box {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
  gap: 5px;
}
</style>

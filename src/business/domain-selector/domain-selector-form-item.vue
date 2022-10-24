<template>
  <div class="tag-box">
    <ant-tag :key="index" v-for="(item, index) in modelValue">{{ item.domainName }}</ant-tag>
  </div>
  <ant-button style="display: block" type="primary" size="default" @click="handleOpenDomainModal">
    <template #icon>
      <EditOutlined/>
    </template>
    修改领域
  </ant-button>
  <domain-select-modal
    v-if="isDomainModalVisible"
    :selected-domain-list="modelValue"
    :isModalVisible="isDomainModalVisible"
    @close="handleDomainModalClose($event)"></domain-select-modal>
</template>

<script lang="ts">
import { domainBaseTypeId } from '@/business/domain-selector/domain.selector';
import { EditOutlined } from '@ant-design/icons-vue';
import { Button, Tag } from 'ant-design-vue';
import { defineComponent, PropType, ref } from 'vue';
import DomainSelectModal from './domain-selector-modal.vue';

export default defineComponent({
  name: 'domain-selector-form-item',
  props: {
    modelValue: {
      type: Array as PropType<{
        domainId: string[];
        domainName?: string;
        domainBaseTypeId: string;
      }[]>,
      required: true
    },
    // 为了上层能够响应ant design form 需要在props中声明 value id
    value: String,
    id: String
  },
  components: {
    EditOutlined,
    DomainSelectModal,
    AntButton: Button,
    AntTag: Tag
  },
  // 为了上层能够响应ant design form 的表单验证 blur change，需要在emit中声明
  emits: ['update:modelValue', 'blur', 'change'],
  setup(props, { emit }) {
    const isDomainModalVisible = ref(false);
    const domainListProp = ref<{
      domainId: string[];
      domainName?: string;
      domainBaseTypeId: string;
    }[]>();
    const handleOpenDomainModal = () => {
      domainBaseTypeId.value = undefined;
      console.log(domainBaseTypeId.value)
      isDomainModalVisible.value = true;
    };

    async function handleDomainModalClose(event?: {
      domain: {
        domainId: string[];
        domainName?: string;
        domainBaseTypeId: string;
      }[]
    }) {
      isDomainModalVisible.value = false;
      if (event) {
        emit('update:modelValue', event.domain);
      }
    }

    return {
      isDomainModalVisible,
      domainListProp,
      domainBaseTypeId,
      handleOpenDomainModal,
      handleDomainModalClose
    };
  }
});
</script>

<style scoped lang="scss">
.tag-box {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}
</style>

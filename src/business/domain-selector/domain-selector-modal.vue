<template>
  <ant-modal
    width="80%"
    :wrapClassName="'full-modal'"
    title="修改领域"
    :maskClosable="false"
    okText="确定"
    cancelText="取消"
    :centered="true"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="7999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <div class="modal-content">
      <div class="tag-title">
        已选择领域
      </div>
      <div class="domain-tag-list" v-if="domain.target.length">
        <ant-tag
          :visible="true"
          closable
          @close="handleDeleteDomainTag(item)"
          :key="index"
          v-for="(item, index) in domain.target">
          {{ item.domainName || '-' }}
        </ant-tag>
      </div>
      <div class="domain-list-container">
        <div class="list-box">
          <router-menu-list
            style="width: 245px;"
            :activeId="domainBaseTypeId"
            @onClickItem="handleClickMenu($event)"
            :title="'搜索实体类型'" :type="'normal'" :navList="navList"></router-menu-list>
          <domain-panel
            @selectChange="handleSelectedChange($event)"
            :select-keys="domainIdList.target"
            :domain-tree="domainTree.target"></domain-panel>
        </div>
      </div>
    </div>
  </ant-modal>
</template>

<script lang="ts" setup>
import { Modal as AntModal, Tag as AntTag } from 'ant-design-vue';
import { computed, defineEmits, defineProps, onMounted, PropType, ref, watchEffect } from 'vue';
import {
  domain,
  domainBaseTypeId,
  domainBaseTypeList,
  domainIdList,
  domainList,
  DomainSelector,
  domainTree
} from '@/business/domain-selector/domain.selector';
import DomainPanel from '@/business/domain-panel/domain-panel.vue';
import { RouterMenuList } from '@/github.style.component';

const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
  selectedDomainList: {
    type: Array as PropType<{
      domainId: string;
      domainName?: string,
      domainBaseTypeId: string;
    }[]>,
    required: true
  }
});
const emit = defineEmits(['close']);

const modalConfirmLoading = ref(false);
const isLoading = ref(false);
const domainSelect = new DomainSelector();

const enabledDomainList = computed(() => domainBaseTypeList.target.filter(
  (item) => {
    const result = domain.target.find((domainItem) => domainItem.domainBaseTypeId === item.id);
    return !result;
  }
));

const navList = computed(() => enabledDomainList.value.map(item => ({
  value: item.id,
  name: item.name,
  path: ''
})));

watchEffect(() => {
  domain.target = props.selectedDomainList;
});

async function handleDomainBaseTypeChange(event: string) {
  isLoading.value = true;
  await domainSelect.getDomainTree(event);
  isLoading.value = false;
}

async function handleSelectedChange(params: {
  id: string,
  type: 'add' | 'remove'
}) {
  if (!domainBaseTypeId.value) {
    return;
  }
  if (params.type === 'add') {
    domainIdList.target.push(params.id);
    domain.target.push({
      domainId: params.id,
      domainName: domainList.target.find((item) => item.id === params.id)?.name,
      domainBaseTypeId: domainBaseTypeId.value
    });
  } else {
    domainIdList.target.forEach((item, index) => {
      if (item === params.id) {
        domainIdList.target.splice(index, 1);
      }
    });
    domain.target.forEach((item, index) => {
      if (item.domainId === params.id) {
        domain.target.splice(index, 1);
      }
    });
  }
  domainBaseTypeId.value = enabledDomainList.value.length ? enabledDomainList.value[0].id : undefined;
  if (domainBaseTypeId.value) {
    await handleDomainBaseTypeChange(domainBaseTypeId.value);
  }
}

async function handleClickMenu(event: {
  name: string;
  value: string;
  index: number
}) {
  domainBaseTypeId.value = event.value;
  await handleDomainBaseTypeChange(event.value);
}

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


async function handleDeleteDomainTag(params: {
  domainId: string;
  domainName?: string,
  domainBaseTypeId: string;
}): Promise<void> {
  domainIdList.target.forEach((item, index) => {
    if (item === params.domainId) {
      domainIdList.target.splice(index, 1);
    }
  });
  domain.target.forEach((item, index) => {
    if (item.domainId === params.domainId) {
      domain.target.splice(index, 1);
    }
  });
  domainBaseTypeId.value = enabledDomainList.value.length ? enabledDomainList.value[0].id : undefined;
  if (domainBaseTypeId.value) {
    await handleDomainBaseTypeChange(domainBaseTypeId.value);
  }
}

onMounted(async () => {
  await domainSelect.getDomainBaseTypeList();
  domainBaseTypeId.value = enabledDomainList.value[0].id;
  if (domainBaseTypeId.value) {
    await domainSelect.getDomainTree(domainBaseTypeId.value);
  }
});
</script>

<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
    padding: 0;
  }
}
</style>

<style scoped lang="scss">
@import "../../style/common.scss";

.modal-content {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: $contentBackgroundColor;
  position: relative;
}

.tag-title {
  margin: 0 auto;
  height: 50px;
  max-width: 1200px;
  line-height: 36px;
  font-size: 16px;
  font-weight: bold;
  padding: 14px 20px 0;
}

.domain-tag-list {
  height: 40px;
  padding: 0 20px;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
  border-bottom: 1px solid $borderColor;
}

.domain-list-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 0;
  padding: 10px 0;
  overflow-y: auto;
  @include custom-scroll-style;

  .list-box {
    display: flex;
    padding: 0 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>

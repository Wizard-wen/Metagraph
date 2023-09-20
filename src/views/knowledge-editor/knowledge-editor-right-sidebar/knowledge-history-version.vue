<template>
  <div class="history-list-container">
    <template v-if="isLoading">
      <ant-skeleton active v-for="item in 3"></ant-skeleton>
    </template>
    <template v-else>
      <template v-if="historyVersionList.length">
        <div class="label" v-for="(item, index) in historyVersionList" :key="index">
          <div class="text">{{ item.parsed.version }}</div>
          <div class="control">
            <ant-dropdown
              :getPopupContainer="getPopupContainer"
              :trigger="['click']"
              :overlayClassName="'dropdown-overlay'">
              <div class="icon-content-style">
                <MoreOutlined/>
              </div>
              <template #overlay>
                <ant-menu class="dropdown-menu-style">
                  <ant-menu-item
                    class="menu-item-style" @click="handleDeleteHistoryVersion">
                    <DeleteOutlined class="icon-size"/>
                    删除
                  </ant-menu-item>
                </ant-menu>
              </template>
            </ant-dropdown>
            <div class="icon-content-style" @click="handleViewHistoryVersion">
              <eye-outlined/>
            </div>
          </div>
        </div>
      </template>
      <empty-view v-else></empty-view>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { createVNode, inject, onMounted, ref } from 'vue';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  MoreOutlined
} from '@ant-design/icons-vue';
import {
  draftKnowledgeEntityIdInjectKey,
  historyVersionList,
  KnowledgeEdit
} from '@/views/knowledge-editor/model/knowledge.edit';
import {
  Dropdown as AntDropdown,
  Menu as AntMenu,
  message,
  Modal,
  Skeleton as AntSkeleton
} from 'ant-design-vue';
import EmptyView from '@/components/empty-view/empty-view.vue';

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

const AntMenuItem = AntMenu.Item;
const knowledgeEdit = new KnowledgeEdit();
const isLoading = ref(false);

const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey, ref(''));

function handleDeleteHistoryVersion() {
  Modal.confirm({
    title: '确定删除当前版本?',
    okText: '确定',
    cancelText: '取消',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除版本操作不可恢复，请谨慎操作',
    async onOk() {
      // todo
      message.info('暂未开通');
    },
    onCancel() {
      message.info('取消删除');
    }
  });
}

function handleViewHistoryVersion() {
  // todo
  message.info('暂未开通');
}

onMounted(() => {
  isLoading.value = true;
  knowledgeEdit.getHistoryVersionList(draftKnowledgeEntityId.value).finally(() => {
    isLoading.value = false;
  });
});
</script>

<style scoped lang="scss">
@import '../../../style/common.scss';

.history-list-container {
  height: 100%;
  padding: 10px 8px;
}

.label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  line-height: 32px;
  padding: 0 8px;
  border-radius: 4px;

  .icon-content-style {
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    cursor: pointer;

    .arrow-icon {
      font-size: 12px;
    }

    &:hover {
      background: #e7e9e8;
    }
  }

  &:hover {
    background: #eff0f0;
  }

  .text {
    text-align: left;
    cursor: pointer;
    flex: 1;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
  }

  .control {
    display: flex;
  }
}
</style>

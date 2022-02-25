<template>
  <ant-modal
    :width="1200"
    wrapClassName="full-modal"
    v-if="isModalVisible"
    title="绑定知识点"
    :maskClosable="false"
    :footer="null"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="7999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-spin :spinning="isLoading">
      <div class="modal-content">
        <div class="search">
          <ant-input
            class="search-input"
            v-model:value="searchText"
            @change="handleChange"></ant-input>
          <ant-button @click="createNewEntity">创建</ant-button>
        </div>
        <div class="list-box">
          <div v-if="searchData.target.length" class="list-content">
            <knowledge-list-item
              :key="index"
              v-for="(item, index) in searchData.target"
              :repository="item">
              <template #control>
                <div class="control-btn banner-item" v-if="!item.hasBind">
                  <bind-icon class="icon"></bind-icon>
                  <div
                    class="text"
                    @click="handleBindKnowledgeToRepository(item.entity.id)">绑定
                  </div>
                </div>
              </template>
            </knowledge-list-item>
          </div>
          <div class="load-content" v-if="searchData.target.length && totalPage > currentPage">
            <ant-button @click="handleLoadMore">
              加载更多
            </ant-button>
          </div>
        </div>
      </div>
    </ant-spin>
  </ant-modal>
</template>

<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { debounce } from 'lodash';
import {
  defineComponent, toRef, watch, ref, onMounted, inject, createVNode
} from 'vue';
import {
  Modal, message, Input, Button, Spin
} from 'ant-design-vue';
import KnowledgeListItem from '@/github.style.component/knowledge-list-item/knowledge-list-item.vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import {
  CreateOrBindKnowledgeModal,
  searchText,
  searchData,
  bindEntityIdList,
  total,
  totalPage,
  currentPage,
  isLoading
} from '@/views/repository-editor/toolbar/create-or-bind-knowledge-modal/create.or.bind.knowledge.modal';
import { BindIcon } from '@/components/icons';

export default defineComponent({
  name: 'create-or-bind-knowledge-modal',
  components: {
    KnowledgeListItem,
    BindIcon,
    AntModal: Modal,
    AntInput: Input,
    AntButton: Button,
    AntSpin: Spin,
  },
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    searchValue: {
      type: String,
    }
  },
  setup(props, context) {
    const isModalVisible = toRef(props, 'isModalVisible');
    const searchValue = toRef(props, 'searchValue');
    const createOrBindKnowledgeModal = new CreateOrBindKnowledgeModal();
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const isModalShow = ref(false);
    const modalConfirmLoading = ref(false);
    isLoading.value = true;
    watch(isModalVisible, async (newValue) => {
      if (newValue) {
        isModalShow.value = newValue;
      }
    });
    const handleModalOk = () => {
      context.emit('close');
    };
    const handleModalCancel = () => {
      context.emit('close');
    };
    const createNewEntity = async () => {
      if (searchText.value === '') {
        message.error('知识点名称不能为空！');
        return;
      }
      Modal.confirm({
        title: '确定创建新知识点吗?',
        okText: '确定',
        cancelText: '取消',
        zIndex: 9001,
        icon: createVNode(ExclamationCircleOutlined),
        content: '',
        async onOk() {
          modalConfirmLoading.value = true;
          await createOrBindKnowledgeModal.createNewEntity(repositoryEntityId.value);
          modalConfirmLoading.value = false;
          context.emit('close');
        },
        async onCancel() {
          // todo
        },
      });
    };

    const handleBindKnowledgeToRepository = async (entityId: string) => {
      modalConfirmLoading.value = true;
      await createOrBindKnowledgeModal.handleBindKnowledgeToRepository({
        repositoryEntityId: repositoryEntityId.value,
        entityId
      });
      modalConfirmLoading.value = false;
      context.emit('close');
    };

    async function getEntityList() {
      modalConfirmLoading.value = true;
      await createOrBindKnowledgeModal.getEntityList();
      modalConfirmLoading.value = false;
    }

    const handleChange = debounce(async () => {
      if (searchText.value === '') {
        searchText.value = undefined;
      }
      searchData.target = [];
      currentPage.value = 1;
      await getEntityList();
    }, 300);

    const handleLoadMore = async () => {
      currentPage.value += 1;
      await getEntityList();
    };
    onMounted(async () => {
      await createOrBindKnowledgeModal.getRepositoryBindEntityList(repositoryEntityId.value);
      if (searchValue.value) {
        console.log(searchValue.value);
        searchText.value = searchValue.value;
      } else {
        searchText.value = '';
      }
      currentPage.value = 1;
      searchData.target = [];
      await getEntityList();
    });
    return {
      isModalShow,
      modalConfirmLoading,
      handleModalOk,
      handleModalCancel,
      searchText,
      searchData,
      handleChange,
      handleLoadMore,
      total,
      currentPage,
      totalPage,
      createNewEntity,
      handleBindKnowledgeToRepository,
      bindEntityIdList,
      isLoading
    };
  }
});
</script>

<style scoped lang="scss">
.full-modal {
  &::v-deep(.ant-modal) {
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
  }
}

.modal-content {
  height: 600px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  .search {
    height: 32px;
    display: flex;
    margin-bottom: 18px;
    gap: 20px;

    .search-input {
      width: 300px;
    }
  }

  .list-box {
    height: 550px;
    overflow-y: auto;

    .list-content {
      .banner-item {
        font-size: 14px;
        display: flex;
        height: 25px;
        gap: 5px;
        align-items: center;

        .span-color {
          display: inline-block;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #2ea44f;
          margin-right: 5px;
        }

        .icon {
          font-size: 14px;
        }

        .text {
          font-size: 14px;
        }
      }

      .control-btn {
        position: absolute;
        padding: 2px 12px;
        font-size: 12px;
        line-height: 18px;
        top: 16px;
        right: 16px;
        border: 1px solid #1b1f2326;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;

        &::v-deep(.ant-btn) {
          height: 28px;
        }
      }
    }

    .load-content {
      text-align: center;
      margin-top: 12px;
      height: 32px;
      line-height: 32px;
    }
  }

}
</style>

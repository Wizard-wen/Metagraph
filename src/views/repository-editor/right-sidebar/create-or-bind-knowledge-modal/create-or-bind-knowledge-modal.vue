<template>
  <ant-modal
    width="100%"
    :wrapClassName="'full-modal'"
    title="搜索知识点"
    :maskClosable="false"
    :footer="null"
    :centered="true"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="7999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <div class="modal-content">
      <div class="search">
        <div class="search-container">
          <ant-input
            size="large"
            placeholder="请输入要查找的知识点"
            :allowClear="true"
            class="custom-input-style search-input"
            v-model:value="searchText"
            @change="handleChange"></ant-input>
        </div>
      </div>

      <div class="list-container">
        <div class="list-box">
          <template  v-if="isLoading">
            <ant-skeleton v-for="item in 5" :key="item"></ant-skeleton>
          </template>
          <template v-else>
            <template v-if="searchData.target.length">
              <knowledge-view-item
                :key="index"
                v-for="(item, index) in searchData.target"
                :activity-item="item">
                <template #control>
                  <m-button
                    v-if="!item.hasBind"
                    :title="'绑定'"
                    @click="handleBindKnowledgeToRepository(item.entity.id)">
                    <template #icon>
                      <LinkOutlined/>
                    </template>
                  </m-button>
                </template>
              </knowledge-view-item>
              <div class="load-content" v-if="totalPage > currentPage">
                <m-button :title="'加载更多'" @click="handleLoadMore"></m-button>
              </div>
            </template>
            <empty-view :description="'暂无数据，您可以创建新的知识点'" v-else>
              <template #content>
                <div style="width: 100%;display: flex;justify-content: center">
                  <m-button
                    style="width: 200px"
                    :title="'创建新知识点'"
                    v-if="searchText"
                    @click="handleCreateCreateDraftKnowledge">
                  </m-button>
                </div>
              </template>
            </empty-view>
          </template>
        </div>
      </div>
    </div>
  </ant-modal>
</template>

<script lang="ts" setup>
import { IndexdbService } from '@/service/indexdb.service';
import { ExclamationCircleOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { debounce } from 'lodash';
import { KnowledgeResponseType } from '@metagraph/constant';
import { createVNode, defineEmits, defineProps, inject, onMounted, ref, toRef, watch } from 'vue';
import { Input as AntInput, message, Modal, Skeleton as AntSkeleton } from 'ant-design-vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { MButton } from '@/metagraph-ui';
import { useRouter } from 'vue-router';
import KnowledgeViewItem from '@/views/home-page/no-auth-main-list/knowledge-view-item.vue';
import EmptyView from '@/components/empty-view/empty-view.vue';
import {
  CreateOrBindKnowledgeModal,
  currentPage,
  isLoading,
  searchData,
  searchText,
  totalPage
} from './create.or.bind.knowledge.modal';

const AntModal = Modal;
const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
  searchValue: {
    type: String,
  }
});
const emit = defineEmits(['close']);

const router = useRouter();
const isModalVisible = toRef(props, 'isModalVisible');
const searchValue = toRef(props, 'searchValue');
const createOrBindKnowledgeModal = new CreateOrBindKnowledgeModal();
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const isModalShow = ref(false);
const modalConfirmLoading = ref(false);
const isCreateDraftKnowledgeFormShow = ref(false);
isLoading.value = true;
watch(isModalVisible, async(newValue) => {
  if(newValue) {
    isModalShow.value = newValue;
  }
});
const handleModalOk = () => {
  emit('close');
};
const handleModalCancel = () => {
  emit('close');
};

function handleCancelCreateDraftKnowledge() {
  isCreateDraftKnowledgeFormShow.value = false;
}

function handleShowCreateDraftKnowledgeForm() {
  isCreateDraftKnowledgeFormShow.value = true;
}

async function createNewDraftKnowledge(params: {
  name: string;
  knowledgeBaseTypeId: string
}) {
  Modal.confirm({
    title: '确定创建新知识点吗?',
    okText: '确定',
    cancelText: '取消',
    zIndex: 9001,
    icon: createVNode(ExclamationCircleOutlined),
    content: '',
    async onOk() {
      modalConfirmLoading.value = true;
      const result = await createOrBindKnowledgeModal
        .createNewDraftKnowledge({
          ...params,
          repositoryEntityId: repositoryEntityId.value
        });
      modalConfirmLoading.value = false;
      if(result) {
        const knowledgeContent = result.content as KnowledgeResponseType;
        await IndexdbService.getInstance()
          .put('knowledge', {
            id: result.entity.id,
            name: knowledgeContent.name,
            description: knowledgeContent.description ?? '',
            entityId: result.entity.id,
            type: 'draft',
            knowledgeKey: knowledgeContent.knowledgeKey
          });
        router.push({
          name: 'KnowledgeEditor',
          query: {
            draftKnowledgeEntityId: result.entity.id,
            repositoryEntityId: repositoryEntityId.value,
          }
        })
          .then();
      }
      emit('close');
    },
    async onCancel() {
      message.info('取消创建!');
    },
  });
}

async function handleCreateCreateDraftKnowledge() {
  if(!searchText.value) {
    message.error('搜索文本丢失，请重新输入！');
    return;
  }
  await createNewDraftKnowledge({
    name: searchText.value,
    knowledgeBaseTypeId: '606fe62050a08412400387e5'
  });
}

async function handleBindKnowledgeToRepository(entityId: string) {
  modalConfirmLoading.value = true;
  await createOrBindKnowledgeModal.handleBindKnowledgeToRepository({
    repositoryEntityId: repositoryEntityId.value,
    entityId
  });
  modalConfirmLoading.value = false;
  emit('close');
}

async function getEntityList() {
  modalConfirmLoading.value = true;
  await createOrBindKnowledgeModal.getEntityList();
  modalConfirmLoading.value = false;
}

const handleChange = debounce(async() => {
  if(searchText.value === '') {
    searchText.value = undefined;
    isCreateDraftKnowledgeFormShow.value = false;
  }
  searchData.target = [];
  currentPage.value = 1;
  await getEntityList();
}, 300);

async function handleLoadMore() {
  currentPage.value += 1;
  await getEntityList();
}

onMounted(async() => {
  await createOrBindKnowledgeModal.getRepositoryBindEntityList(repositoryEntityId.value);
  if(searchValue.value) {
    searchText.value = searchValue.value;
  } else {
    searchText.value = '';
  }
  currentPage.value = 1;
  searchData.target = [];
  await getEntityList();
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
@import "../../../../style/common.scss";

.modal-content {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: $contentBackgroundColor;
  position: relative;

  .search {
    height: 65px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid $borderColor;
    padding-left: 12px;

    .search-container {
      display: flex;
      gap: 20px;
      @include custom-input-style-mixin;

      .search-input {
        width: 600px;
      }
    }
  }

  .list-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 65px;
    bottom: 0;
    padding: 20px 0;
    overflow-y: auto;
    @include custom-scroll-style;

    .list-box {
      padding: 0 20px;
      max-width: 1200px;
      margin: 0 auto;

      .load-content {
        text-align: center;
        margin-top: 12px;
        height: 32px;
        line-height: 32px;
      }
    }
  }
}
</style>

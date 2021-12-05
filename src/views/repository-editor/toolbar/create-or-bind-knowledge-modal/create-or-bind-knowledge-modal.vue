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
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
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
          <div class="entity-card" v-for="item in searchData.target">
            <div>
              暂无封面
            </div>
            <div class="title">
              {{ item.content?.repositoryEntityId }} / {{ item.content.name }}
            </div>
            <div class="statistic">
              <div class="statistic-item">
                <star-icon class="icon"></star-icon>
                {{ item.star }}
              </div>
              <div class="statistic-item">
                <comment-icon class="icon"></comment-icon>
                {{ item.comment }}
              </div>
              <div class="statistic-item bind-item"
                   v-if="!bindEntityIdList.target.includes(item.entity.id)">
                <bind-icon class="icon"></bind-icon>
                <span
                  class="bind-button"
                  @click="handleBindKnowledgeToRepository(item.entity.id)">绑定</span>
              </div>
            </div>
          </div>
        </div>
        <div class="load-content" v-if="searchData.target.length && totalPage > currentPage">
          <ant-button @click="handleLoadMore">
            加载更多
          </ant-button>
        </div>
      </div>
    </div>
  </ant-modal>
</template>

<script lang="ts">
import { debounce } from 'lodash';
import {
  defineComponent, toRef, watch, ref, onMounted, inject
} from 'vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import {
  CreateOrBindKnowledgeModal,
  searchText,
  searchData,
  bindEntityIdList,
  total,
  totalPage,
  currentPage
} from '@/views/repository-editor/toolbar/create-or-bind-knowledge-modal/create.or.bind.knowledge.modal';
import { StarIcon, CommentIcon, BindIcon } from '@/components/icons';

export default defineComponent({
  name: 'create.bind.knowledge.modal',
  components: {
    StarIcon, CommentIcon, BindIcon
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
    watch(isModalVisible, async (newValue, oldValue) => {
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
      modalConfirmLoading.value = true;
      await createOrBindKnowledgeModal.createNewEntity(repositoryEntityId.value);
      modalConfirmLoading.value = false;
      context.emit('close');
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
        searchText.value = searchValue.value;
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
      bindEntityIdList
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
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 15px;
      justify-content: flex-start;

      .entity-card {
        min-height: 150px;
        border-radius: 4px;
        border: 1px solid #cccccc;
        display: grid;
        grid-template-rows: auto 32px 32px;

        .title {
          line-height: 32px;
          padding: 0 15px;
          border-top: 1px solid #ccc;
        }

        .statistic {
          height: 30px;
          line-height: 30px;
          text-align: center;
          box-sizing: border-box;
          border-top: 1px solid #CCC;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;

          .statistic-item {
            box-sizing: border-box;
            border-right: 1px solid #CCC;
            font-size: 14px;
            vertical-align: middle;

            .icon {
              margin-right: 10px;
            }
          }

          .bind-item {
            border-right: none;
            &:hover {
              cursor: pointer;
              background: #0969DC;
              color: #FFFFFF;
            }
          }
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

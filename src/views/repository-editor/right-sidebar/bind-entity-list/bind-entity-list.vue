<template>
  <div class="entity-list">
    <div class="add-control">
      <ant-button class="add-entity-button" @click="handleModalShow" v-if="editable">
        <template #icon>
          <PlusOutlined/>
        </template>
        绑定/创建知识点
      </ant-button>
    </div>
    <div class="entity-list-content">
      <div class="list-item"
           :class="{'list-item-active': item.entity.id === selectedEntityId}"
           v-for="item in entityList"
           :key="item.id">
        <div class="text" v-if="item.content.repositoryEntityId === repositoryEntityId">
          <StarOutlined class="icon"/>
          {{ item.content.name }}
        </div>
        <div class="text text-no-icon" v-else>
          {{ item.content.name }}
        </div>
        <div class="control">
          <EditIcon
            v-if="item.content.repositoryEntityId === repositoryEntityId && editable"
            @click="handleClickEntityItem(item, 'edit')"></EditIcon>
          <ViewIcon @click="handleClickEntityItem(item, 'view')"></ViewIcon>
        </div>
      </div>

      <div
        class="list-item"
        v-for="item in unpublishedDraftKnowledgeList"
        :key="item.entity.id">
        <div class="text">
          <SnippetsOutlined class="icon"/>
          {{ item.content.name }}
        </div>
        <div class="control">
          <EditIcon @click="handleClickEntityItem(item, 'draft')"></EditIcon>
        </div>
      </div>

    </div>
  </div>
  <create-or-bind-knowledge-modal
    v-if="isModalVisible"
    @close="handleModalClose"
    :is-modal-visible="isModalVisible"></create-or-bind-knowledge-modal>
</template>

<script lang="ts">
import { Button } from 'ant-design-vue';
import {
  defineComponent, ref, computed, inject
} from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, StarOutlined, SnippetsOutlined } from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType, KnowledgeModelType, KnowledgeResponseType } from 'metagraph-constant';
import {
  repositoryBindEntityList,
  unpublishedDraftKnowledgeList,
  RepositoryEditor
} from '@/views/repository-editor/repository-editor';
import { knowledgeDrawerState } from '@/business';
import { isEditableKey, repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import { useStore } from '@/store';
import { ViewIcon, EditIcon } from '@/components/icons';
import CreateOrBindKnowledgeModal from '../create-or-bind-knowledge-modal/create-or-bind-knowledge-modal.vue';

export default defineComponent({
  components: {
    PlusOutlined,
    StarOutlined,
    SnippetsOutlined,
    ViewIcon,
    EditIcon,
    CreateOrBindKnowledgeModal,
    AntButton: Button,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const repositoryEditor = new RepositoryEditor();
    const editable = inject(isEditableKey, ref(false));
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const entityList = computed(() => repositoryBindEntityList.target
      .filter((item) => item.entity.entityType === 'Knowledge'));
    const selectedEntityId = computed(() => store.state.repositoryEditor.selectedEntityId);
    // modal
    const isModalVisible = ref<boolean>(false);
    const modalConfirmLoading = ref<boolean>(false);
    const handleModalShow = () => {
      isModalVisible.value = true;
    };
    const handleModalClose = async () => {
      isModalVisible.value = false;
      await repositoryEditor.getRepositoryBindEntityList(repositoryEntityId.value);
    };

    function handleClickEntityItem(
      item: EntityCompletelyListItemType,
      type: 'view' | 'edit' | 'draft'
    ): void {
      if (type === 'view') {
        knowledgeDrawerState.entityId = item.entity.id;
        knowledgeDrawerState.isShow = true;
      } else if (type === 'draft') {
        router.push({
          name: 'KnowledgeEdit',
          query: {
            draftKnowledgeEntityId: item.entity.id,
            repositoryEntityId: repositoryEntityId.value
          }
        })
          .then();
      } else {
        router.push({
          name: 'KnowledgeEdit',
          query: {
            publishedKnowledgeEntityId: item.entity.id,
            draftKnowledgeEntityId: (item.content as KnowledgeResponseType).draft?.entityId,
            repositoryEntityId: repositoryEntityId.value
          }
        })
          .then();
      }
    }

    return {
      repositoryBindEntityList,
      unpublishedDraftKnowledgeList,
      entityList,
      selectedEntityId,
      isModalVisible,
      modalConfirmLoading,
      handleModalShow,
      handleModalClose,
      handleClickEntityItem,
      repositoryEntityId,
      editable
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../../../style/common.scss';

.entity-list {
  .add-control {
    padding: 10px 15px 0 15px;

    .add-entity-button {
      width: 100%;
    }
  }

  .entity-list-content {
    height: calc(100vh - 140px);
    padding: 10px 15px 0 15px;
    overflow-y: auto;

    .list-item {
      height: 35px;
      line-height: 35px;
      width: 100%;
      text-align: left;
      text-indent: 5px;
      display: flex;
      justify-content: space-between;

      &:hover {
        @include list-item-highlight;
        text-indent: 5px;
      }

      .text {
        .icon {
          text-indent: 0px
        }
      }

      .text-no-icon {
        padding-left: 17px;
      }

      .control {
        font-size: 20px;
        line-height: 35px;
      }
    }

    .list-item-active {
      @include list-item-highlight;
    }
  }

  .toolbar-entity-list-item {
    height: 100%;
    overflow: scroll;
  }
}

</style>

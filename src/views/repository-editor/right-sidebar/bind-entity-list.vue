<template>
  <div class="right-sidebar-container">
    <div class="control-button-content">
      <ant-button class="full-button-style" @click="handleModalShow" v-if="editable">
        <template #icon>
          <PlusOutlined/>
        </template>
        绑定/创建知识点
      </ant-button>
    </div>
    <div class="right-sidebar-content">
      <template
        v-if="entityList.length || unpublishedDraftKnowledgeList?.length">
        <div class="entity-list-item"
             :class="{'entity-list-item-active': item.entity.id === selectedEntityId}"
             v-for="item in entityList"
             :key="item.id">
          <div class="text" v-if="item.content.repositoryEntityId === repositoryEntityId">
            <StarOutlined class="icon" title="归属于知识库"/>
            {{ item.content.name }}
          </div>
          <div class="text" v-else>
            <LinkOutlined class="icon"/>
            {{ item.content.name }}
          </div>
          <div class="control">
            <EditIcon
              v-if="item.content.repositoryEntityId === repositoryEntityId && editable"
              @click="handleClickEntityItem(item, 'edit')"></EditIcon>
            <EyeOutlined @click="handleClickEntityItem(item, 'view')"></EyeOutlined>
          </div>
        </div>
        <div
          class="entity-list-item"
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
      </template>
      <empty-view v-else></empty-view>
    </div>
  </div>
</template>

<script lang="ts">
import EmptyView from '@/components/empty-view/empty-view.vue';
import { Button, Divider } from 'ant-design-vue';
import {
  defineComponent, ref, computed, inject
} from 'vue';
import { useRouter } from 'vue-router';
import {
  PlusOutlined, StarOutlined, SnippetsOutlined, LinkOutlined, EyeOutlined
} from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType, KnowledgeResponseType } from 'metagraph-constant';
import {
  repositoryBindEntityList,
  unpublishedDraftKnowledgeList
} from '@/views/repository-editor/model/repository.editor';
import { isEditableKey, repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { useStore } from '@/store';
import { EditIcon } from '@/components/icons';
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';

export default defineComponent({
  components: {
    EmptyView,
    PlusOutlined,
    StarOutlined,
    SnippetsOutlined,
    EyeOutlined,
    EditIcon,
    LinkOutlined,
    AntButton: Button
  },
  emits: ['createOrBindEntity'],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const knowledgePreview = new KnowledgePreview();
    const editable = inject(isEditableKey, ref(false));
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const entityList = computed(() => repositoryBindEntityList.value
      .filter((item) => item.entity.entityType === 'Knowledge'));
    const selectedEntityId = computed(() => store.state.repositoryEditor.selectedEntityId);
    const handleModalShow = () => {
      emit('createOrBindEntity');
    };

    function handleClickEntityItem(
      item: EntityCompletelyListItemType,
      type: 'view' | 'edit' | 'draft'
    ): void {
      if (type === 'view') {
        knowledgePreview.handleShowKnowledgeDrawer(item.entity.id, 'published');
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
      handleModalShow,
      handleClickEntityItem,
      repositoryEntityId,
      editable
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../../style/common';
@import './right-sidebar.scss';

.entity-list-item {
  height: 32px;
  line-height: 32px;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  font-size: 12px;

  &:hover {
    @include list-item-highlight;
    text-indent: 5px;
  }

  .text {
    .icon {
      text-indent: 0;
      font-size: 14px;
    }
  }

  .text-no-icon {
    padding-left: 17px;
  }

  .control {
    font-size: 16px;
    line-height: 35px;
  }
}

.entity-list-item-active {
  @include list-item-highlight;
}

</style>

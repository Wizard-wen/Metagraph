<template>
  <div class="entity-list">
    <div class="add-control">
      <ant-button class="add-entity-button" @click="handleModalShow" v-if="editable">
        <template #icon>
          <PlusOutlined/>
        </template>
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

    </div>
  </div>
  <CreateBindKnowledgeModal
    v-if="isModalVisible"
    @close="handleModalClose"
    :is-modal-visible="isModalVisible"></CreateBindKnowledgeModal>
  <KnowledgeDrawer
    :isShow="isDrawerShown"
    :entityId="selectedTreeNodeEntityId"
    @showChange="isDrawerShown=false"></KnowledgeDrawer>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, computed, inject
} from 'vue';
import { useRoute } from 'vue-router';
import { PlusOutlined, StarOutlined } from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType } from 'edu-graph-constant';
import {
  BindEntityList,
  isDrawerShown,
  selectedTreeNodeEntityId
} from '@/views/editable.repository/toolbar/bind-entity-list/bind.entity.list';
import { repositoryEntityIdKey } from '@/views/editable.repository/provide.type';
import { ActionEnum, useStore } from '@/store';
import { ViewIcon, EditIcon } from '@/components/icons';
import KnowledgeDrawer from '@/views/editable.repository/knowledge.drawer.vue';
import CreateBindKnowledgeModal from '../create-or-bind-knowledge-modal/create-or-bind-knowledge-modal.vue';

export default defineComponent({
  components: {
    PlusOutlined,
    StarOutlined,
    KnowledgeDrawer,
    ViewIcon,
    EditIcon,
    CreateBindKnowledgeModal
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const repositoryEntityList = computed(() => store.state.repositoryEditor.repositoryEntityList);
    const editable = computed(() => store.state.repositoryEditor.editable);
    const entityList = computed(() => repositoryEntityList.value
      .filter((item: EntityCompletelyListItemType) => item.entity.entityType === 'Knowledge'));
    const selectedEntityId = computed(() => store.state.repositoryEditor.selectedEntityId);
    // modal
    const isModalVisible = ref<boolean>(false);
    const modalConfirmLoading = ref<boolean>(false);
    const handleModalShow = () => {
      isModalVisible.value = true;
    };
    const handleModalClose = () => {
      isModalVisible.value = false;
    };
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const bindEntityList = new BindEntityList();
    const handleClickEntityItem = (item: EntityCompletelyListItemType, type: 'view' | 'edit') => {
      bindEntityList.handleClickEntityItem(item, type, repositoryEntityId.value);
    };
    onMounted(async () => {
      await store.dispatch(ActionEnum.GET_REPOSITORY_BIND_ENTITY_LIST, {
        repositoryEntityId: route.query.repositoryEntityId as string
      });
    });
    return {
      repositoryEntityList,
      entityList,
      selectedEntityId,
      isModalVisible,
      modalConfirmLoading,
      handleModalShow,
      handleModalClose,
      handleClickEntityItem,
      isDrawerShown,
      selectedTreeNodeEntityId,
      repositoryEntityId,
      editable
    };
  }
});
</script>

<style scoped lang="scss">

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
        background: #1790ff;
        color: #fff;
        text-indent: 5px;
        cursor: pointer;
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
      background: #1790ff;
      color: #fff;
    }
  }

  .toolbar-entity-list-item {
    height: 100%;
    overflow: scroll;
  }
}

</style>

<template>
  <ant-card class="card-header">
    <ant-button style="width: 100%" @click="handleModalShow" v-if="editable">
      <template #icon>
        <PlusOutlined/>
      </template>
    </ant-button>
    <CreateBindKnowledgeModal
      v-if="isModalVisible"
      @close="handleModalClose"
      :is-modal-visible="isModalVisible"></CreateBindKnowledgeModal>
    <div class="list-item" :class="{'list-item-active': item.entity.id === selectedEntityId}"
         v-for="item in entityList"
         :key="item.id">
      <div class="text" v-if="item.content.repositoryEntityId === repositoryEntityId">
        <StarOutlined style="text-indent: 0px"/>
        {{ item.content.name }}
      </div>
      <div class="text" v-else>
        <span style="height: 17px; width: 17px; display: inline-block"></span>
        {{ item.content.name }}
      </div>
      <div class="control">
        <EditIcon
          v-if="item.content.repositoryEntityId === repositoryEntityId && editable"
          @click="handleClickEntityItem(item, 'edit')"></EditIcon>
        <ViewIcon @click="handleClickEntityItem(item, 'view')"></ViewIcon>
      </div>
    </div>
  </ant-card>
  <KnowledgeDrawer
    :isShow="isDrawerShown"
    :entityId="selectedTreeNodeEntityId"
    @showChange="isDrawerShown=false"></KnowledgeDrawer>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, computed, toRefs
} from 'vue';
import { ActionEnum, useStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { PlusOutlined, StarOutlined } from '@ant-design/icons-vue';
import ViewIcon from '@/components/icons/view.icon.vue';
import EditIcon from '@/components/icons/edit.icon.vue';
import KnowledgeDrawer from '@/views/editable.repository/knowledge.drawer.vue';
import CreateBindKnowledgeModal from './create.bind.knowledge.modal.vue';

export default defineComponent({
  components: {
    PlusOutlined,
    StarOutlined,
    KnowledgeDrawer,
    ViewIcon,
    EditIcon,
    CreateBindKnowledgeModal
  },
  props: {
    entityType: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { entityType } = toRefs(props);
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const repositoryEntityId = ref('');
    const repositoryEntityList = computed(() => store.state.repositoryEditor.repositoryEntityList);
    const editable = computed(() => store.state.repositoryEditor.editable);
    const entityList = computed(() => repositoryEntityList.value.filter((item: any) => item.entity.entityType === entityType.value));
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
    const isDrawerShown = ref(false);
    const selectedTreeNodeEntityId = ref('');
    const handleClickEntityItem = (item: any, type: 'view' | 'edit') => {
      if (type === 'view') {
        selectedTreeNodeEntityId.value = item.entity.id;
        isDrawerShown.value = true;
        console.log(item, type);
      } else {
        router.push({
          name: 'KnowledgeEdit',
          query: {
            knowledgeEntityId: item.entity.id,
            repositoryEntityId: route.query.repositoryEntityId as string
          }
        });
      }
    };
    onMounted(async () => {
      repositoryEntityId.value = route.query.repositoryEntityId as string;
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
.card-header {
  & ::v-deep(.ant-card-head-title) {
    padding: 0;
    line-height: 45px;
  }

  & ::v-deep(.ant-card-body) {
    padding: 15px;
  }

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
</style>

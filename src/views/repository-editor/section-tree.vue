<template>
  <div class="section-tree">
    <ant-button
      v-if="isEditable"
      style="width: 100%"
      @click="openCreateSectionModal({
        type: 'Section', isRoot: true
      })">
      创建单元
    </ant-button>
    <div class="tree-content">
      <ant-tree
        :tree-data="sectionTree"
        class="ant-tree-customer"
        show-icon
        @select="handleSelectedTreeNode"
        v-model:selectedKeys="selectedTreeNodeKeys">
        <template #Knowledge>
          <knowledge-icon></knowledge-icon>
        </template>
        <template #Section>
          <FolderOutlined/>
        </template>
        <template #title="{ key: treeKey, title, entity, section }" v-if="isEditable">
          <ant-dropdown :trigger="['contextmenu']" :disabled="entity !== undefined">
            <span>{{ title }}</span>
            <template #overlay>
              <ant-menu
                @click="({ key: menuKey }) => handleContextMenuClick(treeKey, menuKey, section)">
                <ant-menu-item key="Section">插入单元</ant-menu-item>
                <ant-menu-item key="Knowledge">绑定知识点</ant-menu-item>
                <ant-menu-item key="ChangeSection">修改</ant-menu-item>
              </ant-menu>
            </template>
          </ant-dropdown>
        </template>
      </ant-tree>
    </div>
    <section-create-modal
      :is-modal-visible="isCreateSectionModalShown"
      @close="isCreateSectionModalShown = false"></section-create-modal>
    <KnowledgeDrawer
      :isShow="isDrawerShown"
      :entityId="selectedTreeNodeEntityId"
      @showChange="isDrawerShown=false"></KnowledgeDrawer>
  </div>
</template>

<script lang="ts">
import {
  FolderOutlined,
} from '@ant-design/icons-vue';
import {
  computed, defineComponent, ref, onMounted, toRefs, watch, inject
} from 'vue';
import { useRoute } from 'vue-router';
import { SelectEvent } from 'ant-design-vue/es/tree/Tree';
import { isEditableKey } from '@/views/repository-editor/provide.type';
import SectionCreateModal from '@/views/repository-editor/section-tree/section-create-modal.vue';
import { KnowledgeIcon } from '@/components/icons';
import { ActionEnum, MutationEnum, useStore } from '@/store';
import KnowledgeDrawer from '../../business/knowledge-drawer/knowledge-drawer.vue';
import {
  sectionModalData,
  SectionTreeService,
  selectedTreeNode
} from '@/views/repository-editor/section-tree/section.tree';

export default defineComponent({
  name: 'section.tree',
  components: {
    KnowledgeIcon,
    SectionCreateModal,
    FolderOutlined,
    KnowledgeDrawer
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const sectionTreeService = new SectionTreeService();
    const sectionTree = computed(() => store.state.repositoryEditor.sectionTree);
    const isEditable = inject(isEditableKey, ref(false));
    const isCreateSectionModalShown = ref(false);
    // 选中的tree节点，交给视图层  v-model使用 ,不能直接使用computed
    const selectedTreeNodeKeys = ref<string[]>([]);
    watch(selectedTreeNode, (newValue, oldValue) => {
      if (newValue && oldValue !== newValue) {
        selectedTreeNodeKeys.value = newValue;
      }
    });
    const isDrawerShown = ref(false);
    const selectedTreeNodeEntityId = computed(() => (store.state.repositoryEditor.selectedTreeNodeEntityKeys[0]?.includes('-')
      ? store.state.repositoryEditor.selectedTreeNodeEntityKeys[0].split('-')[0] : ''));
    onMounted(async () => {
      store.commit(MutationEnum.SET_IS_SPINNING, { status: true });
      await store.dispatch(ActionEnum.GET_SECTION_TREE, {
        repositoryEntityId: route.query.repositoryEntityId as string
      });
      store.commit(MutationEnum.SET_IS_SPINNING, { status: false });
    });

    async function openCreateSectionModal(params: {
      type: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection',
      section?: any,
      isRoot?: boolean
    }) {
      isCreateSectionModalShown.value = true;
      await sectionTreeService.initSectionModal(params);
    }

    async function handleSelectedTreeNode(selectedKeys: string[], info: SelectEvent) {
      store.commit(MutationEnum.SET_IS_SPINNING, { status: true });
      if (!info.node.dataRef.section) {
        isDrawerShown.value = true;
      }
      await store.dispatch(ActionEnum.SELECTED_SECTION_TREE_NODE, {
        selectedKeys,
        info
      });
      store.commit(MutationEnum.SET_IS_SPINNING, { status: false });
    }

    const handleContextMenuClick = (
      treeKey: string,
      menuKey: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection',
      section?: any
    ) => {
      openCreateSectionModal({
        type: menuKey,
        section
      });
    };
    return {
      handleContextMenuClick,
      openCreateSectionModal,
      handleSelectedTreeNode,
      selectedTreeNode,
      selectedTreeNodeKeys,
      isCreateSectionModalShown,
      sectionTree,
      ...toRefs(sectionModalData),
      isDrawerShown,
      selectedTreeNodeEntityId,
      isEditable
    };
  }
});
</script>

<style scoped lang="scss">
.section-tree {
  .tree-content {
    padding-left: 20px;
  }
}

.ant-tree-customer {
  text-align: left;
  //text-indent: 10px;
}
</style>

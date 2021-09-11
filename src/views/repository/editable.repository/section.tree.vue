<template>
  <div class="section-tree">
    <ant-button
      v-if="editable"
      style="width: 100%"
      @click="openCreateSectionModal({type: 'Section', isRoot: true})">
      创建Section
    </ant-button>
    <div class="tree-content">
      <ant-tree
        :tree-data="sectionTree"
        class="ant-tree-customer"
        show-icon
        default-expand-all
        @select="handleSelectedTreeNode"
        v-model:selectedKeys="selectedTreeNodeKeys">
        <template #Knowledge>
          <FileWordOutlined/>
        </template>
        <template #Section>
          <FolderOutlined/>
        </template>
        <template #title="{ key: treeKey, title, entity, section }" v-if="editable">
          <ant-dropdown :trigger="['contextmenu']" :disabled="entity !== undefined">
            <span>{{ title }}</span>
            <template #overlay>
              <ant-menu
                @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey, section)">
                <ant-menu-item key="Section">插入单元</ant-menu-item>
                <ant-menu-item key="Knowledge">绑定知识点</ant-menu-item>
                <ant-menu-item key="Change">修改</ant-menu-item>
              </ant-menu>
            </template>
          </ant-dropdown>
        </template>
      </ant-tree>
    </div>
    <ant-modal
      :title="sectionModalTitle"
      :visible="isCreateSectionModalShown"
      :confirm-loading="confirmLoading"
      @ok="handleCreateSection"
      @cancel="isCreateSectionModalShown = false">
      <ant-input
        v-if="entityType === 'Section' || entityType === 'Change'"
        v-model:value="sectionName"></ant-input>
      <ant-select
        v-else
        v-model:value="selectedEntityId"
        optionLabelProp="label"
        style="width: 100%"
        placeholder="Please select"
        :options="entityOptionList"/>
    </ant-modal>
    <KnowledgeDrawer
      :isShow="isDrawerShown"
      :entityId="selectedTreeNodeEntityId"
      @showChange="isDrawerShown=false"></KnowledgeDrawer>
  </div>
</template>

<script lang="ts">
import { ActionEnum, MutationEnum, useStore } from '@/store';
import {
  FolderOutlined, FileWordOutlined
} from '@ant-design/icons-vue';
import {
  computed, defineComponent, onBeforeMount, ref, onMounted, reactive, watch, toRefs
} from 'vue';
import { useRoute } from 'vue-router';
import { SectionApiService } from '@/api.service';
import { SelectEvent } from 'ant-design-vue/es/tree/Tree';
import KnowledgeDrawer from './knowledge.drawer.vue';

export default defineComponent({
  name: 'section.tree',
  components: {
    FileWordOutlined,
    FolderOutlined,
    KnowledgeDrawer
  },
  setup: function () {
    const route = useRoute();
    const store = useStore();
    const sectionTree = computed(() => store.state.repositoryEdit.sectionTree);
    const selectedTreeNode = computed(() => store.state.repositoryEdit.selectedTreeNode);
    const editable = computed(() => store.state.repositoryEdit.editable);
    const isContextMenuShown = ref(false);
    const isCreateSectionModalShown = ref(false);
    const entityType = ref<'Section' | 'Knowledge' | 'Exercise' | 'Change'>('Section');
    const sectionName = ref<string>('');
    const sectionModalTitle = ref<string>('');
    const confirmLoading = ref(false);
    // 选中的tree节点
    const selectedTreeNodeKeys = ref<string[]>([]);
    // 绑定实体下拉列表
    const selectModalData = reactive({
      entityOptionList: [],
      selectedEntityId: ''
    });
    const isDrawerShown = ref(false);
    const selectedTreeNodeEntityId = ref('');
    onMounted(async () => {
      store.commit(MutationEnum.SET_IS_SPINNING, { status: true });
      await store.dispatch(ActionEnum.GET_SECTION_TREE, {
        repositoryEntityId: route.query.repositoryEntityId as string
      });
      store.commit(MutationEnum.SET_IS_SPINNING, { status: false });
    });
    onBeforeMount(async () => {
      document.addEventListener('contextmenu', (event: MouseEvent) => {
        event.preventDefault();
      });
    });
    watch(selectedTreeNode, (newValue, oldValue) => {
      if (newValue && oldValue !== newValue) {
        store.commit(MutationEnum.SET_SELECTED_ENTITY_ID, { id: selectedTreeNode.value[0] });
        selectedTreeNodeKeys.value = newValue;
      }
    });

    async function openCreateSectionModal(params: {
      type: 'Section' | 'Knowledge' | 'Exercise' | 'Change',
      section?: any,
      isRoot?: boolean
    }) {
      entityType.value = params.type;
      isCreateSectionModalShown.value = true;
      selectModalData.selectedEntityId = '';
      sectionName.value = '';
      if (entityType.value === 'Section') {
        sectionModalTitle.value = '创建Section';
      }
      if (entityType.value === 'Change') {
        sectionModalTitle.value = '修改Section';
        sectionName.value = params?.section?.name || '';
      }
      if (entityType.value === 'Knowledge') {
        sectionModalTitle.value = '绑定实体';
        const result = await SectionApiService.getEntityList({
          name: selectModalData.selectedEntityId,
          entityType: entityType.value,
          pageIndex: 0,
          pageSize: 80
        });
        selectModalData.entityOptionList = result.data.list.map((item: any) => ({
          key: item.entity.id,
          label: item.content.name,
          value: item.entity.id
        }));
      }
      if (params.isRoot) {
        store.commit(MutationEnum.SET_SELECTED_TREE_NODE_KEYS, { key: [] });
      }
    }

    async function handleCreateSection() {
      if (entityType.value === 'Section') {
        await SectionApiService.createSectionTree({
          name: sectionName.value,
          repositoryEntityId: route.query.repositoryEntityId as string,
          parentId: selectedTreeNode.value?.length ? selectedTreeNode.value[0] : undefined,
        });
      } else if (entityType.value === 'Change') {
        await SectionApiService.updateSectionTree({
          name: sectionName.value,
          id: selectedTreeNode.value[0]
        });
      } else {
        if (selectedTreeNode.value.length === 0) {
          return;
        }
        await SectionApiService.bindSectionEntity({
          entityId: selectModalData.selectedEntityId,
          entityType: entityType.value as 'Knowledge',
          repositoryEntityId: route.query.repositoryEntityId as string,
          sectionId: selectedTreeNode.value[0],
        });
      }
      isCreateSectionModalShown.value = false;
      await store.dispatch(ActionEnum.GET_SECTION_TREE, {
        repositoryEntityId: route.query.repositoryEntityId as string
      });
    }

    const getSectionContentByKey = (key: string) => {
      store.dispatch(ActionEnum.GET_SECTION_CONTENT, {
        sectionId: key
      });
    };

    function handleSelectedTreeNode(selectedKeys: string[], info: SelectEvent) {
      console.log(selectedKeys, info);
      // 提交commit改变当前选中的 tree node
      store.commit(MutationEnum.SET_SELECTED_TREE_NODE_KEYS, { keys: selectedKeys });
      if (info.node.dataRef.section) {
        getSectionContentByKey(selectedKeys[0]);
        store.commit(MutationEnum.SET_SELECTED_TREE_NODE_SECTION_KEYS, {
          sectionKeys: selectedKeys
        });
        store.commit(MutationEnum.SET_SELECTED_TREE_NODE_ENTITY_KEYS, { entityKeys: [] });
      } else {
        selectedTreeNodeEntityId.value = selectedKeys[0];
        isDrawerShown.value = true;
        store.commit(MutationEnum.SET_SELECTED_TREE_NODE_SECTION_KEYS, { sectionKeys: [] });
        store.commit(MutationEnum.SET_SELECTED_TREE_NODE_ENTITY_KEYS, { entityKeys: selectedKeys });
      }
    }

    const onContextMenuClick = (treeKey: string, menuKey: 'Section' | 'Knowledge' | 'Exercise' | 'Change', section?: any) => {
      console.log(`treeKey: ${ treeKey }, menuKey: ${ menuKey }`);
      openCreateSectionModal({ type: menuKey, section });
    };
    return {
      // 新的
      onContextMenuClick,
      isContextMenuShown,
      isCreateSectionModalShown,
      sectionTree,
      handleCreateSection,
      getSectionContentByKey,
      entityType,
      openCreateSectionModal,
      sectionName,
      selectedTreeNode,
      selectedTreeNodeKeys,
      handleSelectedTreeNode,
      ...toRefs(selectModalData),
      sectionModalTitle,
      isDrawerShown,
      selectedTreeNodeEntityId,
      editable,
      confirmLoading
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

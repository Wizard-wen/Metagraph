<template>
  <div class="toolbar">
    <div class="tabs">
      <div
        class="tab"
        :class="{ 'active': tab.value === toolbarState }"
        v-for="tab in elementShowTabs"
        :key="tab.value"
        @click="setToolbarState(tab.value)"
      >{{ tab.label }}
      </div>
    </div>
    <div class="content">
      <component :is="currentPanelComponent"></component>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, reactive, inject, ref
} from 'vue';
import { isEditableKey } from '@/views/repository-editor/provide.type';
import { MutationEnum, useStore } from '@/store';
import { ToolbarState } from '@/types/toolbar';
import ToolbarEntityList from './toolbar/bind-entity-list/bind-entity-list.vue';
// import ToolbarKnowledgeEdge from './toolbar/toolbar.knowledge.edge.vue';
import AlternativeKnowledgeList from './toolbar/alternative-knowledge-list/alternative-knowledge-list.vue';

export default defineComponent({
  name: 'Toolbar',
  setup() {
    const store = useStore();
    const isEditable = inject(isEditableKey, ref(false));
    const toolbarState = computed(() => store.state.repositoryEditor.toolbarState);
    const elementTabs = reactive<{
      target: { value: string; label: string; isAuth: boolean }[]
    }>({
      target: [
        {
          label: '已绑定知识点',
          value: 'EntityList',
          isAuth: false
        },
        // { label: '知识链路', value: 'KnowledgeEdge' },
        {
          label: '备选知识点',
          value: 'Alternative',
          isAuth: true
        },
      ]
    });
    const elementShowTabs = computed(() => {
      if (isEditable.value) {
        return elementTabs.target;
      }
      return elementTabs.target.filter((item) => !item.isAuth);
    });
    const setToolbarState = (value: ToolbarState) => {
      store.commit(MutationEnum.SET_TOOLBAR_STATE, value);
    };
    const currentPanelComponent = computed(() => {
      const panelMap: { [key: string]: unknown } = {
        EntityList: ToolbarEntityList,
        // KnowledgeEdge: ToolbarKnowledgeEdge,
        Alternative: AlternativeKnowledgeList
      };
      return panelMap[toolbarState.value] || null;
    });

    return {
      toolbarState,
      elementTabs,
      elementShowTabs,
      currentPanelComponent,
      setToolbarState
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../../style/common';

.toolbar {
  border-left: solid 1px $borderColor;
  background-color: #fff;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .tabs {
    height: 32px;
    font-size: 12px;
    flex-shrink: 0;
    display: flex;

    .tab {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $lightGray;
      border-bottom: 1px solid $borderColor;
      cursor: pointer;

      &.active {
        background-color: #fff;
        border-bottom-color: #fff;
      }

      & + .tab {
        border-left: 1px solid $borderColor;
      }
    }
  }

  .content {
    font-size: 13px;
    overflow: scroll;
  }
}
</style>

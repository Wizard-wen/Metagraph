/**
 * @author songxiwen
 * @date  2022/5/5 00:38
 */

import { ref } from 'vue';

export const knowledgeDrawerState = ref<{
  isShow: boolean,
  type?: 'published' | 'draft',
  entityId?: string
}>({
  isShow: false,
  type: undefined,
  entityId: undefined
});

export function showKnowledgeDrawer(type: 'published' | 'draft', entityId: string): void {
  knowledgeDrawerState.value.entityId = entityId;
  knowledgeDrawerState.value.isShow = true;
  knowledgeDrawerState.value.type = type;
}

export function closeKnowledgeDrawer(): void {
  knowledgeDrawerState.value.isShow = false;
  knowledgeDrawerState.value.entityId = undefined;
  knowledgeDrawerState.value.type = undefined;
}

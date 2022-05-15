/**
 * @author songxiwen
 * @date  2022/5/5 00:38
 */

import { reactive } from 'vue';

export const knowledgeDrawerState = reactive<{
  isShow: boolean,
  type?: 'published' | 'draft',
  entityId?: string
}>({
  isShow: false,
  type: undefined,
  entityId: undefined
});

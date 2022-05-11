/**
 * @author songxiwen
 * @date  2022/5/5 00:38
 */

import { reactive } from 'vue';

export const knowledgeDrawerState = reactive<{
  isShow: boolean,
  entityId: string
}>({
  isShow: false,
  entityId: ''
});

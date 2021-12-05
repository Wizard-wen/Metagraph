/**
 * @author songxiwen
 * @date  2021/11/28 15:16
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { EntityCompletelyListItemType } from 'edu-graph-constant';

const router = useRouter();
export const selectedTreeNodeEntityId = ref('');
export const isDrawerShown = ref(false);

export class BindEntityList {
  handleClickEntityItem(
    item: EntityCompletelyListItemType,
    type: 'view' | 'edit',
    repositoryEntityId: string
  ) {
    if (type === 'view') {
      selectedTreeNodeEntityId.value = item.entity.id;
      isDrawerShown.value = true;
      console.log(item, type);
    } else {
      router.push({
        name: 'KnowledgeEdit',
        query: {
          knowledgeEntityId: item.entity.id,
          repositoryEntityId
        }
      }).then();
    }
  }
}

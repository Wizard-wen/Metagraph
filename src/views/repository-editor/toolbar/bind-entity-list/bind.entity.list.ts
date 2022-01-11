/**
 * @author songxiwen
 * @date  2021/11/28 23:16
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { EntityCompletelyListItemType } from 'metagraph-constant';

export const selectedTreeNodeEntityId = ref('');
export const isDrawerShown = ref(false);

export class BindEntityList {
  router = useRouter();

  handleClickEntityItem(
    item: EntityCompletelyListItemType,
    type: 'view' | 'edit',
    repositoryEntityId: string
  ): void {
    if (type === 'view') {
      selectedTreeNodeEntityId.value = item.entity.id;
      isDrawerShown.value = true;
    } else {
      this.router.push({
        name: 'KnowledgeEdit',
        query: {
          knowledgeEntityId: item.entity.id,
          repositoryEntityId
        }
      })
        .then();
    }
  }
}

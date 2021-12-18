/**
 * @author songxiwen
 * @date  2021/11/21 22:02
 */

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { EntityCompletelyListItemType, RepositoryModelType } from 'metagraph-constant';
import {
  ref, reactive, createVNode, computed
} from 'vue';
import { ActionEnum, MutationEnum, store } from '@/store';
import { RepositoryNoAuthApiService, SectionApiService } from '@/api.service';

type AlternativeType = {
  id: string;
  type?: string;
  repositoryEntityId: string;
  articleId: string;
  name: string;
  weight: number;
  userId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface RepositoryEditorInterface {
  getRepositoryByEntityId(repositoryEntityId: string): Promise<void>
}

export const alternative = reactive<{ target: AlternativeType[] | null }>({
  target: null
});

export const repositoryModel = reactive<{
  target?: EntityCompletelyListItemType
}>({
  target: undefined
});

export const isEditable = ref(false);

export const sectionEntityId = computed(() => {
  if (store.state.repositoryEditor.selectedTreeNodeSectionKeys) {
    return store.state.repositoryEditor.selectedTreeNodeSectionKeys[0];
  }
  return undefined;
});

export const isPublicRepository = computed(() => ((repositoryModel.target?.content as RepositoryModelType).type === 'public'));
const userModel = computed(() => store.state.user.user);
export class RepositoryEditor implements RepositoryEditorInterface {

  async getRepositoryByEntityId(repositoryEntityId: string): Promise<void> {
    const response = await RepositoryNoAuthApiService.getById({
      repositoryEntityId
    });
    if (response.data) {
      repositoryModel.target = response.data;
      let status = false;
      if (userModel.value) {
        const content = response.data.content as RepositoryModelType;
        status = content.userId === userModel.value.id;
        isEditable.value = status;
      }
      store.commit(MutationEnum.SET_REPOSITORY_EDITABLE, {
        status
      });
    }
  }

  async handleMention(params: {
    repositoryEntityId: string;
    name: string,
    id: string,
    success: () => string,
    fail: () => string,
    content: Record<string, any>,
    contentHtml: string
  }): Promise<void> {
    Modal.confirm({
      title: '是否绑定知识点至当前单元?',
      icon: createVNode(ExclamationCircleOutlined),
      content: '',
      async onOk() {
        params.success();
        if (sectionEntityId.value) {
          await SectionApiService.bindSectionEntity({
            entityId: params.id,
            entityType: 'Knowledge',
            repositoryEntityId: params.repositoryEntityId,
            sectionId: sectionEntityId.value
          });
          await store.dispatch(ActionEnum.SAVE_SECTION_CONTENT, {
            content: params.content,
            contentHtml: params.contentHtml
          });
        }
      },
      async onCancel() {
        const json = params.fail();
        await store.dispatch(ActionEnum.SAVE_SECTION_CONTENT, {
          content: json,
          contentHtml: params.contentHtml
        });
      },
    });
  }
}

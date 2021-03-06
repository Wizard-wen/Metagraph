/**
 * @author songxiwen
 * @date  2022/5/4 19:51
 */
import { KnowledgeApiService, KnowledgeNoAuthApiService } from '@/api.service';
import { knowledgeDrawerState } from '@/business';
import { EntityCompletelyListItemType } from 'metagraph-constant';
import { ref } from 'vue';

// 知识点发布状态
export const previewKnowledgePublishStatus = ref<string>('未发布');

// 草稿知识点预览
export const draftKnowledgePreviewModel = ref<{
  entity: EntityCompletelyListItemType,
  mentionList: EntityCompletelyListItemType[]
} | undefined>();

// 已发布知识点预览
export const publishedKnowledgePreviewModel = ref<{
  entity: EntityCompletelyListItemType,
  mentionList: EntityCompletelyListItemType[]
} | undefined>();

// 知识点被引用次数
export const publishedKnowledgeMentioned = ref<{
  count: number;
  list: EntityCompletelyListItemType[]
}>();

export class KnowledgePreview {
  async initPublishedKnowledge(publishedKnowledgeEntityId: string): Promise<void> {
    await Promise.all([
      this.setLatestVersionStatus({
        publishedKnowledgeEntityId
      }),
      this.getPublishedKnowledgePreview(publishedKnowledgeEntityId),
      this.getPublishedKnowledgeMentioned(publishedKnowledgeEntityId)
    ]);
  }

  async initDraftKnowledge(draftKnowledgeEntityId: string): Promise<void> {
    await this.getDraftKnowledgePreview(draftKnowledgeEntityId);
  }

  handleShowKnowledgeDrawer(entityId: string, type: 'published' | 'draft') {
    knowledgeDrawerState.entityId = entityId;
    knowledgeDrawerState.isShow = true;
    knowledgeDrawerState.type = type;
  }

  handleCloseKnowledgeDrawer() {
    knowledgeDrawerState.isShow = false;
    knowledgeDrawerState.entityId = undefined;
    knowledgeDrawerState.type = undefined;
    draftKnowledgePreviewModel.value = undefined;
    publishedKnowledgePreviewModel.value = undefined;
  }

  /**
   * 获取已发布知识点最新版本
   * @param params
   * @private
   */
  private async setLatestVersionStatus(params: {
    publishedKnowledgeEntityId: string;
  }): Promise<void> {
    if (!params.publishedKnowledgeEntityId) {
      previewKnowledgePublishStatus.value = '未发布';
      return;
    }
    const result = await KnowledgeNoAuthApiService.getLatestVersion({
      publishedKnowledgeEntityId: params.publishedKnowledgeEntityId
    });
    if (result.data) {
      previewKnowledgePublishStatus.value = `版本${result.data}`;
    }
  }

  /**
   * 获取已发布知识点的被引用次数
   * @param publishedKnowledgeEntityId
   */
  private async getPublishedKnowledgeMentioned(publishedKnowledgeEntityId: string): Promise<void> {
    const result = await KnowledgeNoAuthApiService.getMentionedList(publishedKnowledgeEntityId);
    if (result.data) {
      publishedKnowledgeMentioned.value = result.data;
    }
  }

  private async getDraftKnowledgePreview(draftKnowledgeEntityId: string): Promise<void> {
    const result = await KnowledgeApiService.getDraftKnowledgePreview({
      draftKnowledgeEntityId
    });
    if (result.data) {
      draftKnowledgePreviewModel.value = result.data;
    }
  }

  async getPublishedKnowledgePreview(publishedKnowledgeEntityId: string): Promise<void> {
    const result = await KnowledgeNoAuthApiService.getPublishedKnowledgePreview({
      publishedKnowledgeEntityId
    });
    if (result.data) {
      publishedKnowledgePreviewModel.value = result.data;
    }
  }
}

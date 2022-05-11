/**
 * @author songxiwen
 * @date  2021/11/24 23:45
 */
import { message } from 'ant-design-vue';
import * as qiniu from 'qiniu-js';
import {
  reactive, ref, computed
} from 'vue';
import { FileEnum } from 'metagraph-constant';
import { FileApiService, KnowledgeApiService, SectionApiService } from '@/api.service';
import { NlpApiService } from '@/api.service/nlp.api.service';

export const wordTitle = ref('');
export const textParsingStatus = reactive<{
  isDoing: boolean,
  text?: '上传中...' | '解析中...'
}>({
  isDoing: false,
  text: '上传中...'
});

export const uploadButtonText = computed(() => {
  if (textParsingStatus.isDoing) {
    return textParsingStatus.text;
  }
  return '确认上传';
});
export const fileUrl = ref<string>();
export const keywords = reactive<{ target: { word: string; weight: number; index: number; }[] }>({
  target: []
});
// 是否展示操作按钮
export const isShowOperationButton = computed(() => wordTitle.value
  && fileUrl.value
  && keywords.target.length);
export const articleText = ref('');

export class SectionArticleControl {
  async customRequestUploadHandler(params: {
    repositoryEntityId: string,
    file: File,
    name: string;
    type: FileEnum
  }): Promise<void> {
    textParsingStatus.isDoing = true;
    textParsingStatus.text = '上传中...';
    const result: {
      data?: {
        key: string;
        uploadToken: string;
      };
      message?: string;
    } = await FileApiService.getCredential({
      name: params.name,
      type: params.type,
      provider: 'AlternativeKnowledgeArticle'
    });
    const tokenForUploading = result.data;

    if (tokenForUploading === undefined) {
      return;
    }
    const observer = {
      complete(response: { key: string; url: string; }) {
        console.log(response);
        fileUrl.value = response.url;
        textParsingStatus.isDoing = true;
        textParsingStatus.text = '解析中...';
        NlpApiService.parseWord({
          url: fileUrl.value!,
          repositoryEntityId: params.repositoryEntityId
        }).then((data) => {
          if (data.data) {
            articleText.value = data.data.text;
            keywords.target = data.data.list.map((item: {
              weight: number,
              word: string
            }, index: number) => ({
              index,
              word: item.word,
              weight: Number(item.weight.toFixed(2))
            }));
          }
        }).finally(() => {
          textParsingStatus.isDoing = false;
        });
      }
    };
    await qiniu
      .upload(
        params.file,
        tokenForUploading.key,
        tokenForUploading.uploadToken
      )
      .subscribe(observer);
  }

  async createWordTextSection(repositoryEntityId: string): Promise<void> {
    if (!wordTitle.value || !wordTitle.value) {
      return;
    }
    const result = await SectionApiService.createSectionTree({
      text: articleText.value,
      name: wordTitle.value,
      repositoryEntityId
    });
    if (result.message) {
      message.error(result.message);
    } else {
      message.success('创建成功!');
    }
  }

  async createAlternativeKnowledgeList(repositoryEntityId: string): Promise<void> {
    if (!wordTitle.value || !fileUrl.value) {
      return;
    }
    const result = await KnowledgeApiService.createAlternativeKnowledgeList({
      article: {
        name: wordTitle.value,
        url: fileUrl.value,
        type: 'word',
      },
      repositoryEntityId,
      entityList: keywords.target.map((item) => ({
        name: item.word,
        weight: item.weight
      }))
    });
    if (result.message) {
      message.error(result.message);
    } else {
      message.success('创建成功!');
    }
  }
}

/**
 * @author songxiwen
 * @date  2021/11/24 23:45
 */
import { message } from 'ant-design-vue';
import { QiniuError, QiniuNetworkError, QiniuRequestError } from 'qiniu-js';
import * as qiniu from 'qiniu-js';
import {
  reactive, ref, computed
} from 'vue';
import { FileEnum, SectionModelType } from 'metagraph-constant';
import { FileApiService, KnowledgeApiService, SectionApiService } from '@/api-service';
import { NlpApiService } from '@/api-service/nlp.api.service';

export type ParsedKeywordType = {
  word: string;
  weight: number;
  index: number;
}

// 待上传文件的重命
export const textFileForm = ref({
  title: ''
});
export const textFileFormRules = ref({
  title: [{
    required: true,
    message: '请输入单元名称',
    trigger: 'blur'
  }]
});

// 上传的文件的url
export const fileUrl = ref<string>();
// 解析出来的关键字
export const keywords = ref<ParsedKeywordType[]>([]);
// 解析出来的文本
export const articleText = ref('');

// 是否展示操作按钮
export const isShowOperationButton = computed(() => fileUrl.value
  && keywords.value.length);
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

export const isShowOperation = computed(() => !(articleText.value && keywords.value.length));
export const suffixText = computed(
  () => (isShowOperation.value ? '上传前可修改默认文件名' : '保存前可修改默认文件名(单元名)')
);

export class UploadAndParseTextService {
  clearData(): void {
    fileUrl.value = undefined;
    articleText.value = '';
    keywords.value = [];
    textFileForm.value.title = '';
    textParsingStatus.text = undefined;
    textParsingStatus.isDoing = false;
  }

  async customRequestUploadHandler(params: {
    repositoryEntityId: string,
    file: File,
    name: string;
    type: FileEnum
  }): Promise<undefined | { key: string; url: string; }> {
    textParsingStatus.isDoing = true;
    textParsingStatus.text = '上传中...';
    const result = await FileApiService.getCredential({
      name: params.name,
      type: params.type,
      provider: 'AlternativeKnowledgeArticle'
    });
    if (!result.data) {
      message.error('上传文件时出错！');
      return Promise.resolve(undefined);
    }
    const tokenForUploading = result.data;
    return new Promise((resolve) => {
      qiniu
        .upload(
          params.file,
          tokenForUploading.key,
          tokenForUploading.uploadToken
        )
        .subscribe({
          complete(response: { key: string; url: string; }) {
            console.log(response);
            fileUrl.value = response.url;
            resolve(response);
          },
          error(error: QiniuError | QiniuRequestError | QiniuNetworkError) {
            console.log(error.message);
            message.error('上传文件时出错！');
            resolve(undefined);
          }
        });
    });
  }

  async parseUploadedFileText(params: {
    fileUrl: string,
    repositoryEntityId: string
  }): Promise<void> {
    textParsingStatus.isDoing = true;
    textParsingStatus.text = '解析中...';
    const result = await NlpApiService.parseWord({
      url: params.fileUrl,
      repositoryEntityId: params.repositoryEntityId
    });
    if (result.data) {
      articleText.value = result.data.text;
      keywords.value = result.data.list.map((item: {
        weight: number,
        word: string
      }, index: number) => ({
        index,
        word: item.word,
        weight: Number(item.weight.toFixed(2))
      }));
    } else {
      message.error('解析文本时出错！');
    }
    textParsingStatus.isDoing = false;
  }

  async createWordTextSection(repositoryEntityId: string): Promise<undefined | SectionModelType> {
    if (!textFileForm.value.title) {
      return undefined;
    }
    const result = await SectionApiService.createSectionTree({
      text: articleText.value,
      name: textFileForm.value.title,
      repositoryEntityId
    });
    if (!result.data) {
      message.error(result?.message ?? '创建新单元时出错');
      return undefined;
    }
    message.success('创建成功!');
    return result.data;
  }

  async createAlternativeKnowledgeList(repositoryEntityId: string): Promise<void> {
    if (!textFileForm.value.title || !fileUrl.value) {
      return;
    }
    const result = await KnowledgeApiService.createAlternativeKnowledgeList({
      article: {
        name: textFileForm.value.title,
        url: fileUrl.value,
        type: 'word',
      },
      repositoryEntityId,
      entityList: keywords.value.map((item) => ({
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

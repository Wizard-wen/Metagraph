/**
 * @author songxiwen
 * @date  2021/11/24 23:45
 */
import { message } from 'ant-design-vue';
import * as qiniu from 'qiniu-js';
import { QiniuError, QiniuNetworkError, QiniuRequestError } from 'qiniu-js';
import { ref } from 'vue';
import { FileEnum, SectionModelType } from '@metagraph/constant';
import { FileApiService, KnowledgeApiService, SectionApiService } from '@/api-service';
import { NlpApiService } from '@/api-service/nlp.api.service';

export type StatusType =
  'preview'
  | 'confirmName'
  | 'uploadSuccess'
  | 'parseSuccess'
  | 'confirmSectionName';
export const currentStatus = ref<StatusType>('preview');

export function changeCurrentStatus(type: StatusType): void {
  currentStatus.value = type;
}

export type ParsedKeywordType = {
  word: string;
  weight: number;
  index: number;
}

// 待上传文件的重命
export const textFileForm = ref({
  filename: '',
  sectionName: ''
});

// 上传的文件的url
export const fileUrl = ref<string>();

export const parsedResultData = ref<{
  articleText: string,
  keywords: ParsedKeywordType[]
}>({
  articleText: '',
  keywords: []
});

export const isUploading = ref(false);
export const isParsing = ref(false);
export const fileNameErrorMessage = ref('');
export const sectionNameErrorMessage = ref('');

export class UploadAndParseTextService {
  clearData(): void {
    currentStatus.value = 'preview';
    fileUrl.value = undefined;
    parsedResultData.value.articleText = '';
    parsedResultData.value.keywords = [];
    textFileForm.value.filename = '';
    textFileForm.value.sectionName = '';
    isParsing.value = false;
    isUploading.value = false;
    sectionNameErrorMessage.value = '';
    fileNameErrorMessage.value = '';
  }

  async customRequestUploadHandler(params: {
    repositoryEntityId: string,
    file: File,
    name: string;
    type: FileEnum
  }): Promise<undefined | { key: string; url: string; }> {
    isUploading.value = true;
    const result = await FileApiService.getCredential({
      name: params.name,
      type: params.type,
      provider: 'AlternativeKnowledgeArticle'
    });
    if (!result.data) {
      message.error('上传失败！');
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
            fileUrl.value = response.url;
            message.success('上传成功！');
            changeCurrentStatus('uploadSuccess');
            isUploading.value = false;
            resolve(response);
          },
          error(error: QiniuError | QiniuRequestError | QiniuNetworkError) {
            console.log(error.message);
            message.error('上传失败！');
            isUploading.value = false;
            resolve(undefined);
          }
        });
    });
  }

  async parseUploadedFileText(params: {
    fileUrl: string,
    repositoryEntityId: string
  }): Promise<void> {
    isParsing.value = true;
    const result = await NlpApiService.parseWord({
      url: params.fileUrl,
      repositoryEntityId: params.repositoryEntityId
    });
    if (result.data) {
      parsedResultData.value.articleText = result.data.text;
      parsedResultData.value.keywords = result.data.list.map((item: {
        weight: number,
        word: string
      }, index: number) => ({
        index,
        word: item.word,
        weight: Number(item.weight.toFixed(2))
      }));
      changeCurrentStatus('parseSuccess');
      message.success('解析成功！');
    } else {
      message.error('解析失败！');
    }
    isParsing.value = false;
  }

  async createWordTextSection(repositoryEntityId: string): Promise<undefined | SectionModelType> {
    if (!textFileForm.value.sectionName) {
      return undefined;
    }
    const result = await SectionApiService.createSectionTree({
      text: parsedResultData.value.articleText,
      name: textFileForm.value.sectionName,
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
    if (!textFileForm.value.filename || !fileUrl.value) {
      return;
    }
    const result = await KnowledgeApiService.createAlternativeKnowledgeList({
      article: {
        name: textFileForm.value.filename,
        url: fileUrl.value,
        type: 'word',
      },
      repositoryEntityId,
      entityList: parsedResultData.value.keywords.map((item) => ({
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

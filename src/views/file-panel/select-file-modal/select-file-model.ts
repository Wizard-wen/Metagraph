import { FileApiService } from '@/api-service';
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { FileEnum, FileResponseType } from '@metagraph/constant';
import {
  filePanelItemData,
  showId
} from '@/views/file-panel/file-panel-list/file-panel-list-model';

export const userFileList = ref<{
  isLoading: boolean,
  pageSize: number,
  pageNumber: number,
  searchInput?: string,
  type?: FileEnum,
  list: FileResponseType[],
  total: number
}>({
  isLoading: false,
  pageSize: 12,
  pageNumber: 1,
  list: [],
  total: 0
});

export const selectFileItemData = reactive<{
  currentId?: string,
  data?: FileResponseType,
  isLoading: boolean
}>({
  currentId: undefined,
  data: undefined,
  isLoading: false
});

export function clearSelectFileItem(): void {
  selectFileItemData.currentId = undefined;
  selectFileItemData.data = undefined;
}

export function setUserFileListConfig(params: {
  pageNumber: number; pageSize: number;
}): void {
  userFileList.value.pageNumber = params.pageNumber;
  userFileList.value.pageSize = params.pageSize;
}

export async function getUserFileList(): Promise<void> {
  return new Promise((resolve) => {
    userFileList.value.isLoading = true;
    FileApiService.getFileList({
      pageIndex: userFileList.value.pageNumber - 1,
      pageSize: userFileList.value.pageSize,
      type: userFileList.value.type ?? undefined,
      searchInput: userFileList.value.searchInput ?? undefined
    }).then((result) => {
      if (result.data) {
        userFileList.value.list = result.data.list;
        userFileList.value.total = result.data.total;
      }
    }).catch(() => {
      message.error('获取文件列表时失败');
    }).finally(() => {
      userFileList.value.isLoading = false;
      resolve();
    });
  });
}

export async function getSelectFileItemById(id: string): Promise<void> {
  return new Promise((resolve) => {
    selectFileItemData.isLoading = true;
    FileApiService.getFileById({ id }).then((result) => {
      if (result.data) {
        selectFileItemData.data = result.data;
      }
      resolve();
    }).catch(() => {
      message.error('获取文件详情时失败');
      resolve();
    }).finally(() => {
      selectFileItemData.isLoading = false;
    });
  });
}

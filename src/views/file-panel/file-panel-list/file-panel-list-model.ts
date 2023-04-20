import { reactive, ref } from 'vue';
import { FileApiService } from '@/api-service';
import { message } from 'ant-design-vue';
import { FileEnum, FileResponseType } from '@metagraph/constant';

export const filePanelList = ref<{
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

export const filePanelItemData = reactive<{
  data?: FileResponseType,
  isLoading: boolean
}>({
  data: undefined,
  isLoading: false
});

export const showId = ref();

export const newFileName = ref('');

export function clearFilePanel(): void {
  showId.value = undefined;
  filePanelItemData.data = undefined;
}

export function setFilePanelListConfig(params: {
  pageNumber: number; pageSize: number;
}): void {
  filePanelList.value.pageNumber = params.pageNumber;
  filePanelList.value.pageSize = params.pageSize;
}

export async function getFilePanelList(): Promise<void> {
  return new Promise((resolve) => {
    filePanelList.value.isLoading = true;
    FileApiService.getFileList({
      pageIndex: filePanelList.value.pageNumber - 1,
      pageSize: filePanelList.value.pageSize,
      type: filePanelList.value.type ?? undefined,
      searchInput: filePanelList.value.searchInput ?? undefined
    }).then((result) => {
      if (result.data) {
        filePanelList.value.list = result.data.list;
        filePanelList.value.total = result.data.total;
      }
    }).catch(() => {
      message.error('获取文件列表时失败');
    }).finally(() => {
      filePanelList.value.isLoading = false;
      resolve();
    });
  });
}

export async function getFilePanelItemById(id: string): Promise<void> {
  return new Promise((resolve) => {
    filePanelItemData.isLoading = true;
    FileApiService.getFileById({ id }).then((result) => {
      if (result.data) {
        filePanelItemData.data = result.data;
        newFileName.value = result.data.name;
      }
      resolve();
    }).catch(() => {
      message.error('获取文件详情时失败');
      resolve();
    }).finally(() => {
      filePanelItemData.isLoading = false;
    });
  });
}

export async function removeFileById(id: string): Promise<void> {
  return new Promise((resolve) => {
    FileApiService.removeFile({
      id
    }).then(() => {
      message.success('删除成功');
    }).catch(() => {
      message.error('删除失败');
    }).finally(() => {
      resolve();
    });
  });
}

export async function updateFile(params: {
  id: string;
  name: string
}): Promise<void> {
  return new Promise((resolve) => {
    FileApiService.updateFile({
      ...params
    }).then(() => {
      message.success('更新成功');
    }).catch(() => {
      message.error('更新失败');
    }).finally(() => {
      resolve();
    });
  });
}

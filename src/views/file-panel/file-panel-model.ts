import { reactive, ref } from 'vue';
import { FileApiService } from '@/api-service';
import { message } from 'ant-design-vue';
import { FileEnum, FileResponseType } from '../../../../metagraph-constant';

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

export const fileData = ref<FileResponseType>();

export function setFilePanelListConfig(params: {
  pageNumber: number; pageSize: number;
}): void {
  filePanelList.value.pageNumber = params.pageNumber;
  filePanelList.value.pageSize = params.pageSize;
}

export async function getFilePanelList(): Promise<void> {
  return new Promise(() => {
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
    });
  });
}

export async function getFilePanelItemById(id: string): Promise<void> {
  return new Promise(() => {
    filePanelItemData.isLoading = true;
    FileApiService.getFileById({ id }).then((result) => {
      if (result.data) {
        filePanelItemData.data = result.data;
        fileData.value = result.data;
      }
    }).catch(() => {
      message.error('获取文件详情时失败');
    }).finally(() => {
      filePanelItemData.isLoading = false;
    });
  });
}

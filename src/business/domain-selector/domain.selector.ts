/**
 * @author songxiwen
 * @date  2022/1/7 18:14
 */

import {
  DomainBaseTypeModelType,
  DomainModelType,
  DomainTreeNodeResponseType
} from 'metagraph-constant';
import { reactive, ref } from 'vue';
import { DomainNoAuthApiService } from '@/api-service';

export const domainTree = reactive<{
  target: DomainTreeNodeResponseType[]
}>({
  target: []
});

export const domainList = reactive<{
  target: DomainModelType[]
}>({
  target: []
});

export const domainBaseTypeList = reactive<{
  target: DomainBaseTypeModelType[]
}>({
  target: []
});

export const domainBaseTypeId = ref<string>();

export const domainIdList = reactive<{ target: string[] }>({ target: [] });
export const domain = reactive<{
  target: {
    domainBaseTypeId: string,
    domainName?: string,
    domainId: string
  }[]
}>({
  target: []
});

export class DomainSelector {
  async getDomainTree(domainBaseTypeId: string): Promise<void> {
    const response = await DomainNoAuthApiService.getTree({ domainBaseTypeId });
    if (response.data) {
      domainTree.target = response.data.tree;
      domainList.target = response.data.list;
    }
  }

  async getDomainBaseTypeList(): Promise<void> {
    const response = await DomainNoAuthApiService.getDomainBaseTypeList();
    if (response.data) {
      domainBaseTypeList.target = response.data;
      // domainBaseTypeId.value = domainBaseTypeList.target[0].id;
    }
  }
}

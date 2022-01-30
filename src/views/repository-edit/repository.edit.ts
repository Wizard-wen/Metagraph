/**
 * @author songxiwen
 * @date  2021/11/29 16:35
 */
import { reactive, UnwrapRef, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { RepositoryApiService } from '@/api.service';

export const repositoryFormRef = ref();
export interface RepositoryFormStateType {
  name: string;
  type: 'public' | 'private';
  description: string;
  domain: {
    domainBaseTypeId: string;
    domainName?: string;
    domainId: string[];
  }[];
  avatar?: string;
}

export const repositoryFormState: UnwrapRef<RepositoryFormStateType> = reactive({
  name: '',
  type: 'public',
  description: '',
  domain: [],
  avatar: ''
});

export const repositoryFormRules = {
  name: [
    {
      required: true,
      message: '请输入仓库名称',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 15,
      message: '仓库名称应当在3-15个字符',
      trigger: 'blur'
    }
  ],
  description: [
    {
      required: true,
      message: '请输入仓库描述',
      trigger: 'blur'
    },
  ],
  domain: [
    {
      type: 'array',
      required: true,
      message: '请选择仓库领域',
      trigger: 'change'
    },
  ],
  // avatar: [
  //   { required: true, message: '请上传图片', trigger: 'value' },
  // ],
};

export class RepositoryEdit {
  router = useRouter();

  async getRepository(repositoryEntityId: string): Promise<void> {
    const result = await RepositoryApiService.getRepositoryByEntityId({ repositoryEntityId });
    if (result.data) {
      repositoryFormState.name = result.data.name;
      repositoryFormState.type = result.data.type;
      repositoryFormState.domain = result.data.domain;
      repositoryFormState.description = result.data.description || '';
    }
  }

  async createRepository(): Promise<void> {
    const response = await RepositoryApiService.createRepository({
      ...repositoryFormState,
      domain: repositoryFormState.domain
    });
    if (response.data) {
      message.success('创建成功');
      this.router.push({
        path: '/repository/editor',
        query: {
          repositoryEntityId: response.data.entity.id,
          type: 'edit'
        }
      })
        .then();
    }
  }

  async updateRepository(repositoryEntityId: string): Promise<void> {
    const response = await RepositoryApiService.updateRepository({
      repositoryEntityId,
      ...repositoryFormState,
      domain: repositoryFormState.domain
    });
    if (!response.message) {
      message.success('更新成功');
      this.router.go(-1);
    }
  }

  // async getDomainTree(domainBaseTypeId: string): Promise<void> {
  //   const response = await DomainNoAuthApiService.getTree({ domainBaseTypeId });
  //   if (response.data) {
  //     console.log(response.data);
  //     domainTree.target = response.data;
  //   }
  // }
  //
  // async getDomainBaseTypeList(): Promise<void> {
  //   const response = await DomainNoAuthApiService.getDomainBaseTypeList();
  //   if (response.data) {
  //     console.log(response.data);
  //     domainBaseTypeList.target = response.data;
  //     domainBaseTypeId.value = domainBaseTypeList.target[0].id;
  //   }
  // }
}

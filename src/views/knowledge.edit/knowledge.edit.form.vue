<template>
  <ant-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol"
            class="knowledge-form-content">
    <ant-form-item :wrapper-col="{ span: 24, offset: 1 }">
      <ant-button type="primary" @click="handlePullRequest">认证</ant-button>
      <ant-button style="margin-left: 10px" type="primary" @click="onSubmit">保存</ant-button>
      <ant-button style="margin-left: 10px" @click="goBack">返回</ant-button>
    </ant-form-item>
    <ant-form-item label="名称">
      <ant-input v-model:value="formState.name"/>
    </ant-form-item>
    <ant-form-item label="基础类型">
      <ant-select v-model:value="formState.knowledgeBaseTypeId" placeholder="请选择知识点基本类型">
        <ant-select-option value="606fe7b650a08412400387e6">公理</ant-select-option>
        <ant-select-option value="606fe62050a08412400387e5">名词</ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="领域">
      <ant-select v-model:value="formState.domainId" placeholder="请指定知识点领域">
        <ant-select-option v-for="item in domainList" :value="item.id">{{ item.name }}</ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="仓库">
      <ant-select disabled v-model:value="formState.repositoryEntityId">
        <ant-select-option :value="item.entity.id" v-for="item in repositoryList.list">
          {{ item.content.name }}
        </ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="标签">
      <ant-tag>Tag 1</ant-tag>
      <ant-tag>Tag 2</ant-tag>
      <ant-tag>Tag 3</ant-tag>
      <ant-button size="small" @click="handleOpenModal">+</ant-button>
    </ant-form-item>
  </ant-form>
  <ant-modal
    v-if="isModalVisible"
    title="Bind Knowledge"
    v-model:visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    @ok="handleModalOk">
    <ant-checkbox-group v-model:value="value">
      <ant-row>
        <ant-col :span="8" v-for="item in tagList">
          <ant-checkbox :value="item.value" @change="handleCheckboxChange"> {{ item.label }}</ant-checkbox>
        </ant-col>
      </ant-row>
    </ant-checkbox-group>
    <ant-button @click="handleLoadMore" v-if="currentPage < total">load more</ant-button>
  </ant-modal>
</template>
<script lang="ts">
import {
  defineComponent, onMounted, PropType, reactive, toRaw, toRef, ref
} from 'vue';
import { TagModelType, EntityCompletelyListItemType } from 'edu-graph-constant';
import { useRoute, useRouter } from 'vue-router';
import { RepositoryApiService, TagApiService, KnowledgeApiService } from '@/api.service';
import { DomainNoAuthApiService } from '@/api.service/no.auth/domain.no.auth.api.service';
import { useStore } from '@/store';

interface FormState {
  name: string;
  knowledgeBaseTypeId: string;
  domainId?: '';
  repositoryEntityId: string;
}

export default defineComponent({
  props: {
    knowledge: {
      type: Object as PropType<FormState>,
      required: true
    }
  },
  setup(props) {
    const knowledge = toRef(props, 'knowledge');
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const formState = reactive(knowledge);
    const isModalVisible = ref(false);
    const modalConfirmLoading = ref(false);
    const selectedTag = ref('');
    const tagList = ref<{ label: string; value: string; }[]>([]);
    const repositoryList = reactive<{ list?: EntityCompletelyListItemType[] }>({});
    const domainList = ref([]);
    const getDomainList = async () => {
      const result = await DomainNoAuthApiService.getList({
        pageIndex: 0,
        pageSize: 10
      });
      if (!result.data) {
        return undefined;
      }
      domainList.value = result.data.list;
    };
    onMounted(async () => {
      const result = await RepositoryApiService.getOwnRepositoryList();
      if (result.data) {
        repositoryList.list = result.data;
      }
      await getDomainList();
    });
    const onSubmit = async () => {
      console.log('submit!', toRaw(formState));
      await KnowledgeApiService.update({
        knowledgeEntityId: route.query.knowledgeEntityId as string,
        domainId: formState.value.domainId,
        knowledgeBaseTypeId: formState.value.knowledgeBaseTypeId,
        name: formState.value.name,
      });
    };
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const getTagList = async () => {
      const result = await TagApiService.getList({
        pageIndex: currentPage.value - 1,
        pageSize: 10
      });
      if (!result.data) {
        return undefined;
      }
      total.value = Math.ceil(Number((result.data?.total / pageSize.value).toFixed(1)));
      tagList.value = tagList.value.concat(result.data?.list.map((item: TagModelType) => ({
        value: item.id,
        label: item.name
      })));
    };

    const handleModalOk = () => {
      isModalVisible.value = false;
    };
    const handleOpenModal = async () => {
      currentPage.value = 1;
      tagList.value = [];
      await getTagList();
      isModalVisible.value = true;
    };
    const handleLoadMore = async () => {
      currentPage.value += 1;
      await getTagList();
    };
    const value = ref([]);
    const selectedTagList = ref<{ label: string; value: string; }[]>([]);
    const handleCheckboxChange = (newValue: any) => {
      console.log(newValue);
      const id = newValue.target.value;
      const tag = tagList.value.find((item) => item.value === id)!;
      const selected = selectedTagList.value.find((item) => item.value === id);
      if (!selected) {
        selectedTagList.value.push(tag);
      }
    };

    const handleDeleteTag = (removedTag: string) => {
      console.log(removedTag);
    };

    const handlePullRequest = () => {

    };

    const goBack = () => {
      router.go(-1);
    };

    return {
      labelCol: { span: 6 },
      wrapperCol: { offset: 0 },
      formState,
      onSubmit,
      repositoryList,
      isModalVisible,
      handleModalOk,
      handleOpenModal,
      getTagList,
      tagList,
      modalConfirmLoading,
      selectedTag,
      value,
      total,
      currentPage,
      pageSize,
      handleLoadMore,
      handleCheckboxChange,
      selectedTagList,
      handleDeleteTag,
      handlePullRequest,
      domainList,
      goBack
    };
  },
});
</script>
<style lang="scss" scoped>
.knowledge-form-content {
  &::v-deep(.ant-form-item) {
    margin-bottom: 20px;
  }
}
</style>

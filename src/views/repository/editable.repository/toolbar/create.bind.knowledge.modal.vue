<template>
  <ant-modal
    v-if="isModalVisible"
    title="绑定知识点"
    :maskClosable="false"
    :footer="null"
    :width="700"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <div>
      <div style="display: flex">
        <ant-input
          style="width: 300px;"
          v-model:value="searchText"
          @change="handleChange"></ant-input>
        <ant-button @click="createNewEntity">创建</ant-button>
      </div>
      <div style="max-height: 600px;overflow: scroll">
        <ant-list  size="small" bordered :data-source="searchData" v-if="searchData.length">
          <template #loadMore>
            <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
              <ant-button v-if="searchData.length && totalPage > currentPage" @click="handleLoadMore">
                加载更多
              </ant-button>
            </div>
          </template>
          <template #renderItem="{ item }">
            <ant-list-item style="cursor:pointer;">
              {{ item.content.name }}
              <template #actions>
                <a
                  v-if="!currentRepositoryBindList.includes(item.entity.id)"
                  @click="handleBindKnowledgeToRepository(item)">绑定</a>
              </template>
            </ant-list-item>
          </template>
        </ant-list>
      </div>
    </div>
  </ant-modal>
</template>

<script lang="ts">
import { debounce } from 'lodash';
import { EntityApiService, KnowledgeApiService, RepositoryApiService } from "@/api.service";
import { ActionEnum, useStore } from "@/store";
import { EntityCompletelyListItemType, KnowledgeModelType } from "edu-graph-constant";
import {
  defineComponent, toRefs, watch, ref, computed, onMounted
} from 'vue';
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: 'create.bind.knowledge.modal',
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    }
  },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const { isModalVisible } = toRefs(props);
    const isModalShow = ref(false);
    const modalConfirmLoading = ref(false);
    const searchText = ref<string | undefined>(undefined);
    const searchData = ref([]);
    const currentRepositoryBindList = ref<string[]>([]);
    const total = ref(0);
    const totalPage = computed(() => Math.ceil((total.value / 10)));
    const currentPage = ref(1);
    const handleModalOk = () => {
      context.emit('close');
    };
    const handleModalCancel = () => {
      context.emit('close');
    }
    watch(isModalVisible, async (newValue, oldValue) => {
      if (newValue) {
        isModalShow.value = newValue;
      }
    });

    const createNewEntity = async (event: MouseEvent) => {
      if (searchText.value === undefined) {
        return;
      }
      modalConfirmLoading.value = true;
      const result = await KnowledgeApiService.create({
        knowledgeBaseTypeId: '606fe62050a08412400387e5',
        repositoryEntityId: route.query.repositoryEntityId as string,
        name: searchText.value
      });
      if (!result.data) {
        throw new Error('');
      }
      await router.push({
        name: 'KnowledgeEdit',
        query: {
          knowledgeEntityId: result.data.entity.id,
          repositoryEntityId: route.query.repositoryEntityId as string,
          name: (<KnowledgeModelType> result.data.content).name
        }
      });
      modalConfirmLoading.value = false;
      context.emit('close');
    };

    const handleBindKnowledgeToRepository = async (item: EntityCompletelyListItemType) => {
      modalConfirmLoading.value = true;
      await RepositoryApiService.BindEntityToRepository({
        repositoryEntityId: route.query.repositoryEntityId as string,
        entityType: 'Knowledge',
        entityId: item.entity.id
      });
      modalConfirmLoading.value = false;
      context.emit('close');
    };

    async function getEntityList() {
      modalConfirmLoading.value = true;
      const result = await EntityApiService.getEntityList({
        name: searchText.value,
        entityType: 'Knowledge',
        pageIndex: currentPage.value - 1,
        pageSize: 10
      });
      searchData.value = searchData.value.concat(result.data.list);
      total.value = result.data.total;
      modalConfirmLoading.value = false;
    }

    onMounted(async () => {
      const result = await RepositoryApiService.getRepositoryBindEntityList(route.query.repositoryEntityId as string);
      if(result.data){
        currentRepositoryBindList.value = result.data.map(item => item.entity.id);
      }
      currentPage.value = 1;
      searchData.value = [];
      await getEntityList()
    })
    const handleChange = debounce(async () => {
      if (searchText.value === '') {
        searchText.value = undefined
      }
      searchData.value = [];
      currentPage.value = 1;
      await getEntityList()
    }, 300)

    const handleLoadMore = async () => {
      currentPage.value += 1;
      await getEntityList()
    }

    return {
      isModalShow,
      modalConfirmLoading,
      handleModalOk,
      handleModalCancel,
      searchText,
      searchData,
      handleChange,
      handleLoadMore,
      total,
      currentPage,
      totalPage,
      createNewEntity,
      handleBindKnowledgeToRepository,
      currentRepositoryBindList
    };
  }
});
</script>

<style scoped>

</style>

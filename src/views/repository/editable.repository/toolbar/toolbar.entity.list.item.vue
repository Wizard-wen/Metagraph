<template>
  <ant-card class="card-header">
    <ant-button style="width: 100%" @click="showModal">
      <template #icon>
        <PlusOutlined/>
      </template>
    </ant-button>
    <ant-modal
      title="Bind Knowledge"
      v-model:visible="isModalVisible"
      :confirm-loading="modalConfirmLoading"
      @ok="handleModalOk">
      <ant-form
        ref="knowledgeFormRef"
        :model="knowledgeFormState"
        :rules="knowledgeFormRules">
        <ant-form-item label="Knowledge" name="name">
          <ant-select
            show-search
            v-model:value="knowledgeFormState.name"
            placeholder="input search text"
            style="width: 200px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            @search="handleSearch"
            @change="handleChange"
          >
            <template #notFoundContent>
              <ant-button style="width: 100%" @click="createNewEntity($event)">
                <template #icon>
                  <PlusOutlined/>
                </template>
              </ant-button>
            </template>
            <ant-select-option v-for="d in searchData" :key="d.entity.id">
              {{ d.content.name }}
            </ant-select-option>
          </ant-select>
        </ant-form-item>
      </ant-form>
    </ant-modal>
    <div class="list-item" :class="{'list-item-active': item.entity.id === selectedEntityId}"
         v-for="item in entityList"
         :key="item.id">
      <div class="text" v-if="item.content.repositoryEntityId === repositoryEntityId">
        <StarOutlined style="text-indent: 0px"/>
        {{ item.content.name }}
      </div>
      <div class="text" v-else>
        <span style="height: 17px; width: 17px; display: inline-block"></span>
        {{ item.content.name }}
      </div>
      <div class="control">
        <EditIcon
          v-if="item.content.repositoryEntityId === repositoryEntityId && editable"
          @click="handleClickEntityItem(item, 'edit')"></EditIcon>
        <ViewIcon @click="handleClickEntityItem(item, 'view')"></ViewIcon>
      </div>
    </div>
  </ant-card>
  <KnowledgeDrawer
    :isShow="isDrawerShown"
    :entityId="selectedTreeNodeEntityId"
    @showChange="isDrawerShown=false"></KnowledgeDrawer>
</template>

<script lang="ts">
import { KnowledgeApiService } from '@/api.service/knowledge.api.service';
import {
  defineComponent, ref, onMounted, reactive, computed, toRaw, toRefs
} from 'vue';
import { ActionEnum, useStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { PlusOutlined, StarOutlined } from '@ant-design/icons-vue';
import { throttle } from 'lodash';
import { EntityApiService, RepositoryApiService } from '@/api.service';
import ViewIcon from '@/components/icons/view.icon.vue';
import EditIcon from '@/components/icons/edit.icon.vue';
import KnowledgeDrawer from '@/views/repository/editable.repository/knowledge.drawer.vue';
import { KnowledgeModelType } from "../../../../../../edu-graph-constant";

export default defineComponent({
  components: {
    PlusOutlined,
    StarOutlined,
    KnowledgeDrawer,
    ViewIcon,
    EditIcon
  },
  props: {
    entityType: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { entityType } = toRefs(props);
    const route = useRoute();
    const router = useRouter();
    const { repositoryEntityId } = route.params;
    const store = useStore();
    const repositoryEntityList = computed(() => store.state.repositoryEdit.repositoryEntityList);
    const editable = computed(() => store.state.repositoryEdit.editable);
    const entityList = computed(() => repositoryEntityList.value.filter((item) => item.entity.entityType === entityType.value));
    const selectedEntityId = computed(() => store.state.repositoryEdit.selectedEntityId);
    // modal
    const isModalVisible = ref<boolean>(false);
    const modalConfirmLoading = ref<boolean>(false);
    // form
    const knowledgeFormRef = ref();
    const knowledgeFormState = reactive<{
      name?: string;
    }>({
      name: undefined
    });
    // modal form
    const showModal = () => {
      if (entityType.value !== 'Knowledge') {
        Modal.error({
          title: 'Bind Exercise',
          content: '暂时不支持绑定习题',
        });
        return;
      }
      isModalVisible.value = true;
      knowledgeFormState.name = '';
    };
    const handleModalOk = async () => {
      if (knowledgeFormState.name === undefined) {
        return;
      }
      modalConfirmLoading.value = true;
      await RepositoryApiService.BindEntityToRepository({
        repositoryEntityId: repositoryEntityId as string,
        entityType: 'Knowledge',
        entityId: knowledgeFormState.name
      });
      isModalVisible.value = false;
      modalConfirmLoading.value = false;
    };

    const searchData = ref<any[]>([]);
    const value = ref();

    const isDrawerShown = ref(false);
    const selectedTreeNodeEntityId = ref('');

    async function getEntityList(name: string) {
      modalConfirmLoading.value = true;
      const result = await EntityApiService.getEntityList({
        name,
        entityType: 'Knowledge',
        pageIndex: 0,
        pageSize: 80
      });
      searchData.value = result.data.list;
      modalConfirmLoading.value = false;
    }

    const handleSearch = throttle((val: string) => {
      console.log('on search');
      knowledgeFormState.name = val;
      getEntityList(knowledgeFormState.name);
    }, 200);
    const handleChange = async (val: string) => {
      console.log('on change');
      knowledgeFormState.name = val;
      await getEntityList(knowledgeFormState.name);
    };
    const createNewEntity = async (event: MouseEvent) => {
      if (knowledgeFormState.name === undefined) {
        return;
      }
      modalConfirmLoading.value = true;
      const result = await KnowledgeApiService.create({
        knowledgeBaseTypeId: '606fe62050a08412400387e5',
        repositoryEntityId: repositoryEntityId as string,
        name: knowledgeFormState.name
      });
      if(!result.data){
        throw new Error('');
      }
      await router.push({
        name: 'KnowledgeEdit',
        query: {
          knowledgeEntityId: result.data.entity.id,
          repositoryEntityId,
          name: (<KnowledgeModelType>result.data.content).name
        }
      });
      await store.dispatch(ActionEnum.GET_REPOSITORY_BIND_ENTITY_LIST, {
        repositoryEntityId
      });
      modalConfirmLoading.value = false;
      isModalVisible.value = false;
    };
    // form function
    const knowledgeFormRules = {
      name: {
        required: true,
        message: 'Please input name',
      },
    };
    const submitKnowledgeForm = () => {
      knowledgeFormRef.value
        .validate()
        .then(() => {
          console.log('values', knowledgeFormState, toRaw(knowledgeFormState));
        })
        .catch((error: Error) => {
          console.log('error', error);
        });
    };
    const resetKnowledgeForm = () => {
      knowledgeFormRef.value.resetFields();
    };

    const handleClickEntityItem = (item: any, type: 'view' | 'edit') => {
      if (type === 'view') {
        selectedTreeNodeEntityId.value = item.entity.id;
        isDrawerShown.value = true;
        console.log(item, type);
      } else {
        router.push({
          name: 'KnowledgeEdit',
          query: {
            knowledgeEntityId: item.entity.id,
            repositoryEntityId
          }
        });
      }
    };
    onMounted(async () => {
      await store.dispatch(ActionEnum.GET_REPOSITORY_BIND_ENTITY_LIST, {
        repositoryEntityId
      });
    });
    return {
      repositoryEntityList,
      entityList,
      selectedEntityId,
      isModalVisible,
      modalConfirmLoading,
      showModal,
      handleModalOk,
      // form
      knowledgeFormRef,
      knowledgeFormState,
      knowledgeFormRules,
      submitKnowledgeForm,
      resetKnowledgeForm,
      handleSearch,
      handleChange,
      searchData,
      value,
      createNewEntity,
      handleClickEntityItem,
      isDrawerShown,
      selectedTreeNodeEntityId,
      repositoryEntityId,
      editable
    };
  }
});
</script>

<style scoped lang="scss">
.card-header {
  & ::v-deep(.ant-card-head-title) {
    padding: 0;
    line-height: 45px;
  }

  & ::v-deep(.ant-card-body) {
    padding: 15px;
  }

  .list-item {
    height: 35px;
    line-height: 35px;
    width: 100%;
    text-align: left;
    text-indent: 5px;
    display: flex;
    justify-content: space-between;

    &:hover {
      background: #1790ff;
      color: #fff;
      text-indent: 5px;
      cursor: pointer;
    }

    .text {

    }

    .control {
      font-size: 20px;
      line-height: 35px;
    }
  }

  .list-item-active {
    background: #1790ff;
    color: #fff;
  }
}
</style>

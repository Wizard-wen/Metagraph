<template>
  <ant-modal
    :width="800"
    title="删除知识库"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-spin :spinning="isLoading">
      <ant-descriptions :column="1" layout="vertical" title="知识点引用情况">
        <ant-descriptions-item label="原创知识点被引用中">
          <div class="tag-list" v-if="usingEntityList.target.length">
            <ant-tag
              v-for="(item, index) in usingEntityList.target" :key="index">
              {{ item.entityModel.content.name }} - {{ item.usageCount }}次
            </ant-tag>
          </div>
          <div v-else>无</div>
        </ant-descriptions-item>
        <ant-descriptions-item label="原创知识点未被引用">
          <div class="tag-list" v-if="neverUsedEntityList.target.length">
            <ant-tag
              v-for="(item, index) in neverUsedEntityList.target" :key="index">
              {{ item.entityModel.content.name }} - {{ item.usageCount }}次
            </ant-tag>
          </div>
          <div v-else>无</div>
        </ant-descriptions-item>
        <ant-descriptions-item label="绑定知识点个数">
          <ant-tag>{{ bindEntityCount }}</ant-tag>
        </ant-descriptions-item>
      </ant-descriptions>
      <ant-descriptions title="删除说明"></ant-descriptions>
      <p><strong>被引用的知识点</strong>将不会立刻被删除，直到没有知识库引用为止，在此期间，知识点不可修改。</p>
      <p><strong>未被引用的知识点</strong>将被删除。</p>
      <p><strong>绑定到当前知识库</strong>的知识点，将被删除绑定关系。</p>
      <p>知识库内创建的<strong>关联关系</strong>将被删除。</p>
      <p>请输入知识库名字，<strong style="color: #ff7875">{{ repositoryName }}</strong>，以确认删除知识库。</p>
      <ant-form
        ref="formRef"
        :rules="rules"
        :model="formState"
        :wrapper-col="wrapperCol">
        <ant-form-item style="margin-top: 20px;" ref="message" name="message">
          <ant-input v-model:value="formState.message"/>
        </ant-form-item>
      </ant-form>
    </ant-spin>
  </ant-modal>
</template>

<script lang="ts">
import {
  Form, Input, Modal, Spin, Descriptions, Tag
} from 'ant-design-vue';
import { EntityCompletelyListItemType } from '@metagraph/constant';
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  reactive, ref, UnwrapRef, toRef, defineComponent, onMounted
} from 'vue';
import { RepositoryApiService } from '@/api-service';

interface FormState {
  message: string;
}

export default defineComponent({
  name: 'repository-delete-confirm-modal',
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    repositoryEntityId: {
      type: String,
      required: true
    }
  },
  components: {
    AntModal: Modal,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntInput: Input,
    AntSpin: Spin,
    AntDescriptions: Descriptions,
    AntDescriptionsItem: Descriptions.Item,
    AntTag: Tag
  },
  emits: ['close'],
  setup(props, { emit }) {
    const repositoryEntityId = toRef(props, 'repositoryEntityId');
    const repositoryName = ref('');
    const formRef = ref();
    const isLoading = ref(false);
    const formState: UnwrapRef<FormState> = reactive({
      message: '',
    });
    const neverUsedEntityList = reactive<{
      target: { entityModel: EntityCompletelyListItemType; usageCount: number }[]
    }>({ target: [] });
    const usingEntityList = reactive<{
      target: { entityModel: EntityCompletelyListItemType; usageCount: number }[]
    }>({ target: [] });
    const bindEntityCount = ref(0);

    function handleModalCancel() {
      emit('close');
    }

    function handleModalOk() {
      formRef.value
        .validate()
        .then(async () => {
          emit('close');
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log('error', error);
        });
    }

    async function validateCustomField(rule: RuleObject, value: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (value === '') {
          reject('请输入知识库名！');
        }
        if (value !== repositoryName.value) {
          reject('输入的知识库名不正确！');
        }
        resolve();
      });
    }

    async function getRepositoryUsingEntity() {
      const result = await RepositoryApiService.getRepositoryUsingEntity({
        repositoryEntityId: repositoryEntityId.value
      });
      if (result.data) {
        neverUsedEntityList.target = result.data.neverUsedEntityList;
        usingEntityList.target = result.data.usingEntityList;
        bindEntityCount.value = result.data.bindEntityCount;
      }
    }

    async function getRepositoryByEntityId() {
      const result = await RepositoryApiService.getRepositoryByEntityId({
        repositoryEntityId: repositoryEntityId.value
      });
      if (result.data) {
        repositoryName.value = result.data.name;
      }
    }

    onMounted(async () => {
      isLoading.value = true;
      await Promise.all([
        getRepositoryUsingEntity(),
        getRepositoryByEntityId()
      ]);
      isLoading.value = false;
    });

    const modalConfirmLoading = ref(false);
    const wrapperCol = { span: 24 };
    const rules = reactive({
      message: [{
        validator: validateCustomField,
        trigger: 'blur',
        required: true
      }]
    });
    return {
      formRef,
      formState,
      wrapperCol,
      rules,
      modalConfirmLoading,
      handleModalOk,
      handleModalCancel,
      isLoading,
      neverUsedEntityList,
      usingEntityList,
      bindEntityCount,
      repositoryName
    };
  }
});
</script>

<style scoped lang="scss">
.tag-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: flex-start
}
</style>

<template>
  <ant-drawer
    width="640"
    placement="right"
    :closable="false"
    :visible="isVisible"
    @close="handleClose">
    <ant-spin :spinning="isLoading">
      <div v-if="knowledgeModel">
        <p class="h2-level-title-style h1-level-title-style">
          {{ knowledgeModel.content.name }}
        </p>
        <ant-divider/>
        <p class="h2-level-title-style">基本信息</p>
        <ant-row>
          <ant-col :span="24">
            <description-item
              title="知识点类型"
              :content="knowledgeModel.content.knowledgeBaseTypeName"/>
          </ant-col>
          <ant-col :span="24">
            <description-item title="知识点领域">
              <template #content>
                <ant-tag v-for="item in knowledgeModel.content.domain">
                  {{ item.domainName }}
                </ant-tag>
              </template>
            </description-item>
          </ant-col>
        </ant-row>
        <ant-row>
          <ant-col :span="12">
            <description-item title="知识库" :content="knowledgeModel.content.repositoryName"/>
          </ant-col>
          <ant-col :span="12">
            <description-item title="作者" :content="knowledgeModel.author.name"/>
          </ant-col>
        </ant-row>
        <ant-row>
          <ant-col :span="24">
            <description-item title="标签">
              <template #content>
                <ant-tag v-for="item in knowledgeModel.tag">{{ item.name }}</ant-tag>
              </template>
            </description-item>
          </ant-col>
        </ant-row>
        <ant-divider/>
        <p class="h2-level-title-style">信息栏</p>
        <ant-row v-for="item in knowledgeModel.content.customField">
          <ant-col :span="24">
            <description-item
              :title="item.label"
              :content="item.value"/>
          </ant-col>
        </ant-row>
        <ant-divider/>
        <p class="h2-level-title-style">知识点描述</p>
        <tiptap-readonly :article-content="knowledgeModel.content.description"></tiptap-readonly>
        <p class="h2-level-title-style">概念图册</p>
        <img v-for="item in knowledgeModel.content.pictures" :src="item.url"/>
      </div>
    </ant-spin>
  </ant-drawer>
</template>

<script lang="ts">
import { EntityCompletelyListItemType } from 'metagraph-constant';
import {
  defineComponent, onMounted, toRef, ref
} from 'vue';
import { EntityNoAuthApiService } from '@/api.service';
import TiptapReadonly from '@/views/repository-editor/section-article/tiptap-readonly.vue';
import DescriptionItem from './description-item.vue';

export default defineComponent({
  name: 'knowledge-drawer-content',
  emits: ['close'],
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    knowledgeEntityId: {
      type: String,
      required: true
    }
  },
  components: {
    TiptapReadonly,
    DescriptionItem
  },
  setup(props, { emit }) {
    const knowledgeEntityId = toRef(props, 'knowledgeEntityId');
    const knowledgeModel = ref<EntityCompletelyListItemType>();
    const isLoading = ref(false);
    const handleClose = () => {
      emit('close');
    };
    onMounted(async () => {
      isLoading.value = true;
      const result = await EntityNoAuthApiService.getEntityById({
        entityId: knowledgeEntityId.value
      });
      isLoading.value = false;
      if (result.data) {
        knowledgeModel.value = result.data;
      }
    });
    return {
      handleClose,
      knowledgeModel,
      isLoading
    };
  },
});
</script>

<style scoped lang="scss">
.h1-level-title-style {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: bolder;
}

.h2-level-title-style {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  display: block;
  margin-bottom: 16px;
}
</style>

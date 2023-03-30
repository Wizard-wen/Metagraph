<template>
  <ant-modal
    title="文本解析"
    :width="'80%'"
    :footer="null"
    :zIndex="7999"
    v-if="isUploadModalShown"
    :visible="isUploadModalShown"
    @cancel="handleCloseParseWordModal({
      type: 'void'
    })">
    <div class="upload-banner">
      <div class="top" v-if="isShowOperation">
        <ant-button class="upload-button">
          <upload-outlined></upload-outlined>
          选择word文本
          <input
            type="file"
            @click="clearCurrentUploadingValue($event)"
            @change="handleFileChange($event)">
        </ant-button>
        <ant-button
          type="primary"
          v-if="currentWordFile"
          @click="confirmUploadWord"
          :isLoading="textParsingStatus.isDoing"
        >{{ uploadButtonText }}
        </ant-button>
      </div>
      <div class="file-name">
        <ant-form
          ref="textFileFormRef"
          :model="textFileForm"
          :rules="textFileFormRules"
          :label-col="labelCol" :wrapper-col="wrapperCol">
          <ant-form-item name="title">
            <ant-input
              ref="fileNameInput"
              v-model:value="textFileForm.title"
              :suffix="suffixText"></ant-input>
          </ant-form-item>
        </ant-form>
      </div>
    </div>
    <ant-tabs v-model:activeKey="activeTab">
      <ant-tabs-pane key="1" tab="文本" class="tab-content">
        <div
          class="doc-text"
          v-if="articleText">
          <p>{{ articleText }}</p>
        </div>
        <empty-view v-else></empty-view>
      </ant-tabs-pane>
      <ant-tabs-pane key="2" tab="关键词" class="tab-content">
        <ant-list
          class="doc-keyword"
          size="small" bordered :data-source="keywords" v-if="keywords.length">
          <template #renderItem="{ item }">
            <ant-list-item class="custom-list-item">
              <div class="left">
                <span class="text">{{ item.word }}</span>
                <ant-tag class="weight-tag">{{ item.weight }}</ant-tag>
              </div>
              <CloseOutlined class="remove-icon" @click="removeKeyword(item.index)"/>
            </ant-list-item>
          </template>
        </ant-list>
        <empty-view v-else></empty-view>
      </ant-tabs-pane>
    </ant-tabs>
    <template #footer>
      <ant-button @click="handleCloseParseWordModal({
        type: 'void'
      })">关闭
      </ant-button>
      <ant-button v-if="!isShowOperation" @click="clearText">清空文件
      </ant-button>
      <ant-button
        type="primary"
        v-if="isShowOperationButton"
        @click="createAlternativeKnowledgeList">保存关键字为备用实体
      </ant-button>
      <ant-button
        type="primary"
        v-if="isShowOperationButton"
        @click="createWordTextSection">将文本创建为新单元
      </ant-button>
    </template>
  </ant-modal>
</template>

<script lang="ts" setup>
import {
  Button as AntButton,
  Form as AntForm,
  Input as AntInput,
  List as AntList,
  Modal as AntModal,
  Tabs as AntTabs,
  Tag as AntTag
} from 'ant-design-vue';
import { FileEnum, SectionModelType } from 'metagraph-constant';
import {
  CloseOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import { defineEmits, defineProps, inject, ref } from 'vue';
import EmptyView from '@/components/empty-view/empty-view.vue';
import { repositoryEntityIdKey } from '../model/provide.type';
import {
  articleText,
  isShowOperation,
  isShowOperationButton,
  keywords,
  suffixText,
  textFileForm,
  textFileFormRules,
  textParsingStatus,
  UploadAndParseTextService,
  uploadButtonText
} from '../model/upload.and.parse.text.service';

const textFileFormRef = ref();

const AntListItem = AntList.Item;
const AntTabsPane = AntTabs.TabPane;
const AntFormItem = AntForm.Item;

const labelCol = { span: 3 };
const wrapperCol = { offset: 0 };

defineProps({
  isUploadModalShown: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['close']);
const uploadAndParseTextService = new UploadAndParseTextService();
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const activeTab = ref('1');
const fileNameInput = ref<HTMLInputElement>();
const currentWordFile = ref<File | undefined>();
// 响应选择word文本
const handleFileChange = (event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  if (target.files === null) {
    return;
  }
  // eslint-disable-next-line prefer-destructuring
  currentWordFile.value = target.files[0];
  textFileForm.value.title = target.files[0].name;
  fileNameInput.value?.focus();
};

function clearText() {
  currentWordFile.value = undefined;
  uploadAndParseTextService.clearData();
}

// 上传word文本
const confirmUploadWord = async () => {
  textFileFormRef.value.validate()
    .then(async () => {
      if (!currentWordFile.value) {
        return;
      }
      const result = await uploadAndParseTextService.customRequestUploadHandler({
        repositoryEntityId: repositoryEntityId.value,
        file: currentWordFile.value,
        name: currentWordFile.value.name,
        type: FileEnum.Text
      });
      if (result) {
        await uploadAndParseTextService.parseUploadedFileText({
          fileUrl: result.url,
          repositoryEntityId: repositoryEntityId.value
        });
      }
    });
};
// 清除 input file
const clearCurrentUploadingValue = (event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  target.value = '';
};

// 关闭modal
function handleCloseParseWordModal(params: {
  type: 'Section' | 'void' | 'Alternative'
  sectionModel?: SectionModelType
}) {
  emit('close', params);
}

// 创建新单元
async function createWordTextSection() {
  textFileFormRef.value.validate()
    .then(async () => {
      const result = await uploadAndParseTextService
        .createWordTextSection(repositoryEntityId.value);
      handleCloseParseWordModal({
        type: 'Section',
        sectionModel: result
      });
    });
}

// 创建备选知识点
const createAlternativeKnowledgeList = async () => {
  await uploadAndParseTextService.createAlternativeKnowledgeList(repositoryEntityId.value);
  handleCloseParseWordModal({
    type: 'Alternative'
  });
};
// 删除关键词
const removeKeyword = (index: number) => {
  keywords.value.splice(index, 1);
};
</script>

<style scoped lang="scss">
.upload-banner {
  .top {
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    //gap: 15px;
    justify-content: space-between;

    .upload-button {
      position: relative;

      input {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 140px;
      }
    }

    //.loading {
    //  height: 40px;
    //  display: flex;
    //  align-items: center;
    //
    //  .spin {
    //    margin-right: 5px;
    //  }
    //}
  }

  .file-name {
    &::v-deep(.ant-input-suffix) {
      color: #cccccc;
    }
  }
}

.tab-content {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
  width: 100%;
}

.doc-text {
  padding: 20px;
  line-height: 24px;
  font-size: 16px;
}

.doc-keyword {
  min-height: 400px;

  .custom-list-item {
    &:hover {
      background: #f3f3f3;
    }

    justify-content: space-between;

    .left {
      display: flex;
      gap: 20px;

      .text {
        min-width: 120px;
      }
    }

    .remove-icon {
      width: 30px;
    }
  }
}
</style>

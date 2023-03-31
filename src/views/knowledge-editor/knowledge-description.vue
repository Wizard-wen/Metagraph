<template>
  <div class="custom-field-box knowledge-description-height
  position-relative">
    <div class="header">
      <div class="title">知识点描述</div>
      <div class="right"></div>
    </div>
    <div v-if="editor" class="limit-count">
      <knowledge-description-limit
        :limit="600"
        :current="descriptionCharacters"></knowledge-description-limit>
    </div>
    <div class="upload-cover-image">
      <div class="cover-content" v-if="knowledgeCover">
        <img class="cover-image-style" :src="knowledgeCover.url" alt="">
      </div>
      <div v-else class="no-cover-content">
        <div class="icon">
          <FileImageOutlined class="icon-style"/>
        </div>
        <div class="message">
          图片格式png/jpg
          <br/>
          高宽像素不低于320px*320px
        </div>
      </div>
      <ant-button
        class="choose-cover-button"
        @click="openSetKnowledgeCover">选择概念图册封面
      </ant-button>
    </div>
    <editor-content
      :style="{fontSize: articleFontSize + 'px'}"
      class="tip-tap-editor custom-editor-style" :editor="editor"/>
  </div>
</template>

<script lang="ts">
import {
  Editor,
  EditorContent
} from '@tiptap/vue-3';
import { defineComponent, PropType } from 'vue';
import { Button } from 'ant-design-vue';
import { FileImageOutlined } from '@ant-design/icons-vue';
import KnowledgeDescriptionLimit from '@/views/knowledge-editor/knowledge-description/knowledge-description-limit.vue';
import { knowledgeCover } from './model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-description',
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    },
    articleFontSize: {
      type: String,
      required: true
    },
    descriptionCharacters: {
      type: Number,
      required: true
    }
  },
  components: {
    AntButton: Button,
    FileImageOutlined,
    EditorContent,
    KnowledgeDescriptionLimit
  },
  emits: ['selectCover'],
  setup(props, { emit }) {
    function openSetKnowledgeCover() {
      emit('selectCover');
    }

    return {
      knowledgeCover,
      openSetKnowledgeCover
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../style/common.scss';
@import "../../style/tiptap.common.scss";
@import "./style/knowledge.edit.scss";

.knowledge-description-height {
  height: 470px;
}

.custom-editor-style {
  width: 620px;
  height: 390px;
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.custom-editor-style::-webkit-scrollbar {
  width: 3px !important;
}

.upload-cover-image {
  position: absolute;
  right: 30px;
  top: 75px;
  height: 270px;
  width: 200px;
  background: #fbfbfb;

  .cover-content {
    height: 194px;
    padding-top: 20px;

    .cover-image-style {
      object-fit: cover;
      height: 170px;
      width: 170px;
    }
  }

  .no-cover-content {
    .icon {
      height: 100px;
      padding-top: 60px;

      .icon-style {
        color: #dedede;
        font-size: 40px
      }
    }

    .message {
      margin-top: 26px;
      font-size: 12px;
      line-height: 24px;
      color: #999;
      margin-bottom: 20px;
    }
  }

  .choose-cover-button {
    margin-top: 20px;
    padding: 0 12px;
    height: 30px;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    line-height: 28px;
    border: 1px solid #d5d5d5;
    border-radius: 2px;
  }
}

.limit-count {
  position: absolute;
  bottom: 10px;
  right: 20px;
}
</style>

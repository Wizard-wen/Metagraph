<template>
  <div class="repository-list-item">
    <slot name="control"></slot>
    <div class="left-icon">
      <knowledge-icon class="repository-icon"></knowledge-icon>
    </div>
    <div class="content">
      <div class="title">
        <span>{{ repository.author.name }}</span>
        <span>/</span>
        <span>{{ repository.content.repositoryName }}</span>
        <ant-tag class="type-tag">知识库</ant-tag>
      </div>
      <div class="sub-title">
        <span>{{ repository.content.name }}</span>
        <ant-tag class="type-tag">知识点</ant-tag>
      </div>
      <div class="description" v-html="repository.content.descriptionHTML">
      </div>
      <div class="tag-list">
        <ant-tag
          v-for="(item, index) in repository.tag"
          :key="index">{{ item.name }}
        </ant-tag>
      </div>
      <div class="banner">
        <div class="banner-item">
          <star-icon class="icon"></star-icon>
          <div class="text">{{ repository.star }}</div>
        </div>
        <div class="banner-item">
          <comment-icon class="icon" style="margin-top: 3px"></comment-icon>
          <div class="text">{{ repository.comment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Tag } from 'ant-design-vue';
import { EntityCompletelyListItemType } from '@metagraph/constant';
import { defineComponent, PropType } from 'vue';
import { StarIcon, CommentIcon, KnowledgeIcon } from '@/components/icons';

export default defineComponent({
  name: 'knowledge-list-item',
  props: {
    repository: {
      type: Object as PropType<EntityCompletelyListItemType>,
      required: true
    }
  },
  components: {
    KnowledgeIcon,
    StarIcon,
    CommentIcon,
    AntTag: Tag
  },
  setup() {

  }
});
</script>
<style scoped lang="scss">
@import '../../style/tiptap.common.scss';

.repository-list-item {
  width: 100%;
  padding: 16px 0;
  display: flex;
  border-bottom: 1px solid #d8dee4;
  position: relative;

  .control-btn {
    position: absolute;
    padding: 2px 12px;
    font-size: 12px;
    line-height: 18px;
    top: 16px;
    right: 16px;
    border: 1px solid #1b1f2326;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;

    &::v-deep(.ant-btn) {
      height: 28px;
    }
  }

  .left-icon {
    height: 25px;
    line-height: 25px;
    display: flex;
    align-items: center;

    .repository-icon {
      font-size: 18px;
      margin-right: 5px;
    }
  }

  .content {
    text-align: left;
    flex: 1;

    .title {
      line-height: 25px;
      font-size: 18px;
      color: #0969DC;
      font-weight: 700;
      margin-bottom: 5px;
      display: flex;
      gap: 5px;
    }

    .sub-title {
      height: 40px;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .type-tag {
      display: inline-block;
      height: 22px;
      border-radius: 4px;
    }

    .description {
      @include raw-html-tiptap-style;
      padding: 5px 10px;
    }

    .tag-list {
      display: flex;

      .tag {
        line-height: 22px;
        padding: 0 8px;
        border: 1px solid transparent;
        border-radius: 12px;
        color: #0969DC;
        background: #ddf4ff;
        margin: 0 5px 5px 0;
      }
    }

    .banner {
      height: 25px;
      display: flex;
      justify-items: center;
      align-items: center;
      gap: 8px;

      .banner-item {
        font-size: 14px;
        display: flex;
        height: 25px;
        gap: 5px;
        align-items: center;

        .span-color {
          display: inline-block;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #2ea44f;
          margin-right: 5px;
        }

        .icon {
          font-size: 14px;
        }

        .text {
          font-size: 14px;
        }
      }
    }
  }
}
</style>

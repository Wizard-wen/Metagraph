<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <div class="author-card">
        <div class="avatar">
          <ant-avatar :size="48"
                      :src="knowledgeEntity.author.avatar"
                      alt="Han Solo"/>
        </div>
        <div class="right-message">
          <div class="user-name">{{ knowledgeEntity.author.name }}</div>
          <div class="user-desc">{{ knowledgeEntity.author.email }}</div>
        </div>
      </div>
      <div class="operation">
        <ant-button
          type="primary"
          style="margin-right: 10px; width: calc(50% - 5px)"
          @click="handleFollowAuthor">关注
        </ant-button>
        <!--        <ant-button style="width: calc(50% - 5px)">私信</ant-button>-->
      </div>
      <div class="activity">
        <div class="activity-item">
          <StarOutlined style="margin-right: 12px;"/>
          获得点赞
          <span class="numbers">{{ knowledgeEntity.star }}</span></div>
        <div class="activity-item">
          <EyeOutlined style="margin-right: 12px;"/>
          总访问量
          <span class="numbers">3000</span></div>
      </div>
    </div>
    <div class="sidebar-content">
      <p class="h2-level-title-style">推荐文章</p>
      <empty-view></empty-view>
    </div>
    <div class="sidebar-content catalog">
      <p class="h2-level-title-style">目录</p>
      <ant-anchor wrapperClass="custom-ant-anchor" :affix="false" @click="handleAnchorClick">
        <ant-anchor-link href="preview-card-1" title="基本信息"/>
        <ant-anchor-link href="preview-card-2" title="信息栏"/>
        <ant-anchor-link href="preview-card-3" title="知识点描述"/>
        <ant-anchor-link href="preview-card-4" title="概念图册"/>
        <ant-anchor-link href="preview-card-5" title="参考知识点"/>
      </ant-anchor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Anchor as AntAnchor, Avatar as AntAvatar, Button as AntButton } from 'ant-design-vue';
import { EyeOutlined, StarOutlined } from '@ant-design/icons-vue';
import EmptyView from '@/components/empty-view/empty-view.vue';
import { computed, defineProps, PropType } from 'vue';
import { EntityCompletelyListItemType } from '@metagraph/constant';

const props = defineProps({
  previewModel: {
    type: Object as PropType<{
      entity: EntityCompletelyListItemType,
      mentionList: EntityCompletelyListItemType[]
    }>,
    required: true
  },
  type: {
    type: String as PropType<'draft' | 'published'>,
    required: true
  }
});

const knowledgeEntity = computed<EntityCompletelyListItemType>(() => props.previewModel?.entity);

const AntAnchorLink = AntAnchor.Link;

function handleAnchorClick(e: Event, link: any) {
  // 阻止点击的默认事件修改路由
  e.preventDefault();
  const scrolls = document.getElementById(link.href);
  scrolls?.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function handleFollowAuthor() {
  // todo
}
</script>

<style scoped lang="scss">
.sidebar {

  width: 300px;
  margin-left: 20px;

  .sidebar-content {
    width: 300px;
    box-shadow: 0 0 3px rgba(0, 0, 0, .2);
    background: #FFFFFF;
    padding: 16px 20px;
    margin-bottom: 20px;
  }

  .h2-level-title-style {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    height: 36px;
    line-height: 36px;
    display: block;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .custom-ant-anchor {
    &::v-deep(.ant-anchor-ink) {
      display: none;
    }
  }

  .catalog {
    position: sticky;
    top: 20px;
  }

  .author-card {
    margin-bottom: 16px;
    display: flex;

    .avatar {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      background: #8a919f;
    }

    .right-message {
      margin-left: 16px;

      .user-name {
        font-size: 16px;
        line-height: 24px;
      }

      .user-desc {
        font-size: 14px;
        margin-top: 2px;
        line-height: 22px;
      }
    }
  }

  .operation {
    display: flex;
    margin-bottom: 16px;
  }

  .activity {
    .activity-item {
      display: flex;
      align-items: center;
      height: 25px;
      margin-top: 8px;

      .numbers {
        margin-left: 12px;
      }
    }
  }
}
</style>

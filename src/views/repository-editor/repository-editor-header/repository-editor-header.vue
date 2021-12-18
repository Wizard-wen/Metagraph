<template>
  <div class="repository-editor-header">
    <div class="left">
      <div class="logo" @click="goHomePage">
        <img src="/hogwarts-logo.webp" height="32" width="32" alt="">
      </div>
      <div class="title">
        <div class="name">{{ repositoryModel.author.name }}</div>
        &nbsp;/&nbsp;
        <div class="name">{{ repositoryModel.content.name }}</div>
        <edit-icon class="edit-icon" @click="goRepositoryEditPage"></edit-icon>
        <ant-tag class="repository-type-tag">
          {{ isPublicRepository ? '公开' : '私有' }}
        </ant-tag>
      </div>
    </div>
    <div class="right">
      <social-action-button
        :title="repositoryModel.hasStared ? '取消点赞' : '点赞'"
        :total="repositoryModel.star"
        @total="isStarDrawerShow = true">
        <template #icon>
          <star-icon></star-icon>
        </template>
      </social-action-button>
      <social-action-button
        @total="isCommentDrawerShow = true"
        :title="'评论'"
        :total="repositoryModel.comment">
        <template #icon>
          <comment-icon></comment-icon>
        </template>
      </social-action-button>
      <div class="view-switch">
        <ant-switch
          checked-children="图谱视图"
          un-checked-children="单元视图"
          v-model:checked="viewStatus"/>
      </div>
    </div>
    <comment-drawer
      :is-show="isCommentDrawerShow"
      :entityId="repositoryModel.entity.id"
      @showChange="isCommentDrawerShow=false"
    ></comment-drawer>
    <star-drawer
      :is-show="isStarDrawerShow"
      :entityId="repositoryModel.entity.id"
      @showChange="isStarDrawerShow=false"
    ></star-drawer>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, inject, PropType, ref, toRef, watch
} from 'vue';
import { EntityCompletelyListItemType, RepositoryModelType } from 'metagraph-constant';
import { useRouter } from 'vue-router';
import StarDrawer from '@/views/repository-editor/star-drawer.vue';
import CommentDrawer from '@/views/repository-editor/comment-drawer.vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import { StarIcon, CommentIcon, EditIcon } from '@/components/icons';
import SocialActionButton from '@/components/social-action-button/social-action-button.vue';

export default defineComponent({
  name: 'repository-editor-header',
  props: {
    repositoryModel: {
      type: Object as PropType<EntityCompletelyListItemType>,
      required: true
    }
  },
  components: {
    StarDrawer,
    StarIcon,
    EditIcon,
    CommentIcon,
    SocialActionButton,
    CommentDrawer,
  },
  emits: ['viewChange'],
  setup(props, { emit }) {
    const router = useRouter();
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const viewStatus = ref(false);
    const repositoryProp = toRef(props, 'repositoryModel');
    const isCommentDrawerShow = ref(false);
    const isStarDrawerShow = ref(false);
    const isPublicRepository = computed(() => ((repositoryProp.value?.content as RepositoryModelType).type === 'public'));
    watch(viewStatus, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        emit('viewChange');
      }
    });
    const goHomePage = async () => {
      await router.push('/');
    };
    const goRepositoryEditPage = async () => {
      await router.push({
        path: '/repository/edit',
        query: {
          repositoryEntityId: repositoryEntityId.value
        }
      });
    };
    return {
      viewStatus,
      repositoryEntityId,
      isPublicRepository,
      isCommentDrawerShow,
      isStarDrawerShow,
      goHomePage,
      goRepositoryEditPage
    };
  }
});
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.repository-editor-header {
  background: #fafbfc;
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;
    gap: 15px;

    .logo {
      cursor: pointer;
    }

    .title {
      margin-right: 16px;
      display: flex;
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      align-items: center;

      .name {
        font-weight: 400;
      }

      .edit-icon {
        font-size: 20px;

        &:hover {
          cursor: pointer;
          color: #0969DC;
        }
      }

      .repository-type-tag {
        height: 24px;
        border-radius: 4px;
        margin-left: 10px;
      }
    }
  }

  .right {
    display: flex;
    gap: 20px;

    .view-switch {
      line-height: 32px;
    }
  }
}
</style>

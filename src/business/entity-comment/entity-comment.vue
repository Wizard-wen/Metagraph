<template>
  <ant-spin :spinning="isLoading">
    <ant-comment v-if="userModel">
      <template #avatar>
        <ant-avatar
          v-if="userModel && userModel.avatar"
          :src="userModel.avatar"
          alt="Han Solo"/>
        <ant-avatar v-else>
          <template #icon>
            <UserOutlined/>
          </template>
        </ant-avatar>
      </template>
      <template #content>
        <ant-form-item class="inner-form-item">
          <ant-text-area :rows="4" v-model:value="commentContent"/>
        </ant-form-item>
        <ant-form-item>
          <ant-button
            html-type="submit"
            :loading="submitting"
            type="primary"
            @click="handleSubmitComment">
            评论
          </ant-button>
        </ant-form-item>
      </template>
    </ant-comment>
    <ant-list
      v-if="commentList.target.length"
      :data-source="commentList.target"
      :header="`${commentCount}条评论`"
      item-layout="horizontal">
      <template #renderItem="{ item }">
        <ant-list-item>
          <ant-comment
            class="custom-ant-comment"
            :avatar="item.user.avatar"
            :content="item.content"
            :author="item.user.name"
            :datetime="item.createdAt">
            <template #actions>
              <div
                class="reply-button"
                v-if="userModel"
                @click="handleOpenReplyDrawer(item, item.id)">回复</div>
              <div
                class="reply-button"
                v-if="item.children.length"
                @click="item.extend = !item.extend">
                {{ item.extend ? '收起' : '展开' }}
              </div>
            </template>
            <div v-if="item.children.length && item.extend">
              <template v-for="(childItem, index) in item.children" :key="index">
                <ant-comment
                  :avatar="childItem.user.avatar"
                  :author="childItem.user.name"
                  :datetime="childItem.createdAt">
                  <template #content>
                    <span style="font-weight: bolder">回复@{{ childItem.replyUser.name }}: </span>
                    {{ childItem.content }}
                  </template>
                  <template #actions>
                    <div
                      v-if="userModel"
                      class="reply-button"
                      @click="handleOpenReplyDrawer(childItem, item.id)">回复</div>
                  </template>
                </ant-comment>
              </template>
            </div>
          </ant-comment>
        </ant-list-item>
      </template>
    </ant-list>
    <ant-drawer
      :title="`回复${reply.name}`"
      width="500"
      :closable="false"
      :visible="reply.isReplying"
      @close="handleCloseReplyDrawer">
      <ant-comment>
        <template #avatar>
          <ant-avatar
            v-if="userModel.avatar"
            :src="userModel.avatar"
            alt="Han Solo"/>
          <ant-avatar v-else>
            <template #icon>
              <UserOutlined/>
            </template>
          </ant-avatar>
        </template>
        <template #content>
          <ant-form-item class="inner-form-item">
            <ant-text-area :rows="4" v-model:value="replyContent"/>
          </ant-form-item>
          <ant-form-item>
            <ant-button
              html-type="submit"
              :loading="submittingReply"
              type="primary"
              @click="handleSubmitReply">
              回复
            </ant-button>
          </ant-form-item>
        </template>
      </ant-comment>
    </ant-drawer>
  </ant-spin>
</template>
<script lang="ts">
import {
  message, Comment, List, Avatar, Form, Button, Drawer, Spin, Input
} from 'ant-design-vue';
import {
  defineComponent, onMounted, ref, toRef, reactive, computed
} from 'vue';
import { CommentEntityType, CommentListItemType } from 'metagraph-constant';
import { UserOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { CommonUtil } from '@/utils';
import { CommentNoAuthApiService, CommentApiService } from '@/api.service';

export default defineComponent({
  props: {
    entityId: {
      type: String,
      required: true
    },
    entityType: {
      type: String,
      required: true
    }
  },
  components: {
    UserOutlined,
    AntComment: Comment,
    AntSpin: Spin,
    AntTextArea: Input.TextArea,
    AntList: List,
    AntListItem: List.Item,
    AntAvatar: Avatar,
    AntButton: Button,
    AntDrawer: Drawer,
    AntFormItem: Form.Item
  },
  setup(props) {
    const store = useStore();
    const entityType = toRef(props, 'entityType');
    const entityId = toRef(props, 'entityId');
    const commentList = reactive<{
      target: CommentListItemType[]
    }>({ target: [] });
    const submitting = ref<boolean>(false);
    const submittingReply = ref<boolean>(false);
    const commentContent = ref<string>('');
    const replyContent = ref<string>('');
    const isLoading = ref(false);
    const commentCount = ref<number>(0);
    const reply = reactive<{
      isReplying: boolean,
      name: string,
      rootCommentId: string,
      replyId?: string,
      replyUserId?: string
    }>({
      isReplying: false,
      name: '',
      rootCommentId: '',
    });
    const userModel = computed(() => store.state.user.user);
    const getCommentList = async () => {
      isLoading.value = true;
      commentCount.value = 0;
      const result = await CommentNoAuthApiService.getCommentByEntityId({
        entityId: entityId.value,
        entityType: entityType.value as CommentEntityType,
        pageIndex: 0,
        pageSize: 10
      });
      if (result.data) {
        commentList.target = result.data.list.map((item) => {
          commentCount.value += 1;
          const result = {
            ...item,
            createdAt: CommonUtil.formatDate(new Date(item.createdAt),
              'yyyy-MM-dd hh:mm') as any
          };
          if (item.children) {
            const children = item.children.map((childItem) => {
              commentCount.value += 1;
              return {
                ...childItem,
                createdAt: CommonUtil.formatDate(new Date(childItem.createdAt),
                  'yyyy-MM-dd hh:mm') as any
              };
            });
            return {
              ...result,
              children,
              isExtend: false
            };
          }
          return result;
        });
      } else {
        message.error('获取失败');
      }
      isLoading.value = false;
    };

    function handleOpenReplyDrawer(item: CommentListItemType, rootId: string) {
      reply.isReplying = true;
      reply.name = item.user?.name || '';
      reply.replyId = item.id;
      reply.replyUserId = item.user?.id;
      reply.rootCommentId = rootId;
    }

    async function handleCloseReplyDrawer() {
      reply.isReplying = false;
      reply.name = '';
      reply.rootCommentId = '';
      await getCommentList();
    }

    async function handleSubmitComment() {
      if (!commentContent.value) {
        return;
      }
      submitting.value = true;
      await CommentApiService.create({
        entityId: entityId.value,
        entityType: entityType.value as CommentEntityType,
        content: commentContent.value
      });
      await getCommentList();
      commentContent.value = '';
      submitting.value = false;
    }

    async function handleSubmitReply() {
      if (!replyContent.value) {
        return;
      }
      submittingReply.value = true;
      await CommentApiService.create({
        entityId: entityId.value,
        rootCommentId: reply.rootCommentId,
        replyId: reply.replyId,
        replyUserId: reply.replyUserId,
        entityType: entityType.value as CommentEntityType,
        content: replyContent.value
      });
      submittingReply.value = false;
      replyContent.value = '';
      await handleCloseReplyDrawer();
    }

    onMounted(async () => {
      await getCommentList();
    });
    return {
      commentList,
      submitting,
      submittingReply,
      commentContent,
      handleSubmitComment,
      isLoading,
      handleOpenReplyDrawer,
      handleCloseReplyDrawer,
      handleSubmitReply,
      reply,
      commentCount,
      replyContent,
      userModel
    };
  },
});
</script>

<style lang="scss" scoped>
.inner-form-item {
  &::v-deep(.ant-form-item-control-wrapper) {
    width: 100%;
  }
}

.reply-button {
  cursor: pointer;
  margin-right: 8px;
}

.custom-ant-comment {
  ::v-deep(.ant-comment-inner) {
    //padding: 0;
  }
}
</style>

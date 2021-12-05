<template>
  <ant-comment>
    <template #avatar>
      <ant-avatar
        src="http://file.songxiwen.com.cn/icon1.jpeg"
        alt="Han Solo"/>
    </template>
    <template #content>
      <ant-form-item class="inner-form-item">
        <ant-text-area :rows="4" v-model:value="commentContent"/>
      </ant-form-item>
      <ant-form-item>
        <ant-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmitComment">
          评论
        </ant-button>
      </ant-form-item>
    </template>
  </ant-comment>
  <ant-list
    v-if="commentList.length"
    :data-source="commentList"
    :header="`${commentList.length} ${commentList.length > 1 ? 'comments' : 'comment'}`"
    item-layout="horizontal">
    <template #renderItem="{ item }">
      <ant-list-item>
        <ant-comment
          :avatar="item.user.avatar"
          :content="item.content"
          :author="item.user.name"
          :datetime="item.createdAt">
<!--          <template #actions>-->
<!--            <span >reply to</span>-->
<!--          </template>-->
        </ant-comment>
      </ant-list-item>
    </template>
  </ant-list>
</template>
<script lang="ts">
import {
  defineComponent, onMounted, PropType, ref, toRef, watch
} from 'vue';
import { CommentEntityType } from 'edu-graph-constant';
import { CommentNoAuthApiService, CommentApiService } from '@/api.service';

type Comment = Record<string, string>;

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
  setup(props) {
    const entityType = toRef(props, 'entityType');
    const entityId = toRef(props, 'entityId');
    const commentList = ref<any[]>([]);
    const submitting = ref<boolean>(false);
    const commentContent = ref<string>('');
    watch(entityType, (newValue) => {
      console.log(newValue, 'sssssss');
    });
    const getCommentList = async () => {
      const result = await CommentNoAuthApiService.getCommentByEntityId({
        entityId: entityId.value,
        entityType: entityType.value as CommentEntityType,
        pageIndex: 0,
        pageSize: 10
      });
      if (result.data) {
        commentList.value = result.data.list;
      }
    };
    const handleSubmitComment = async () => {
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
      submitting.value = false;
    };
    onMounted(async () => {
      await getCommentList();
    });
    return {
      commentList,
      submitting,
      commentContent,
      handleSubmitComment,
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
</style>

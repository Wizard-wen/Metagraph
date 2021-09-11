<template>
  <ant-comment>
    <template #avatar>
      <ant-avatar
        src="http://file.songxiwen.com.cn/icon1.jpeg"
        alt="Han Solo"/>
    </template>
    <template #content>
      <ant-form-item class="inner-form-item">
        <ant-text-area :rows="4" v-model:value="value"/>
      </ant-form-item>
      <ant-form-item>
        <ant-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
          评论
        </ant-button>
      </ant-form-item>
    </template>
  </ant-comment>
  <ant-list
    v-if="comments.length"
    :data-source="comments"
    :header="`${comments.length} ${comments.length > 1 ? 'comments' : 'comment'}`"
    item-layout="horizontal">
    <template #renderItem="{ item }">
      <ant-list-item>
        <ant-comment
          :avatar="item.user.avatar"
          :content="item.content"
          :author="item.user.name"
          :datetime="item.createdAt">
        </ant-comment>
      </ant-list-item>
    </template>
  </ant-list>
</template>
<script lang="ts">
import { CommentApiService } from '@/api.service';
import { useStore } from '@/store';
import {
  defineComponent, onMounted, PropType, ref, toRefs
} from 'vue';
import { useRoute } from 'vue-router';
import { CommentEntityType } from 'edu-graph-constant';

type Comment = Record<string, string>;

export default defineComponent({
  props: {
    entityId: {
      type: String,
      required: true
    },
    entityType: {
      type: String as PropType<CommentEntityType>,
      required: true
    }
  },
  setup(props) {
    const { entityType, entityId } = toRefs(props);
    const comments = ref<any[]>([]);
    const submitting = ref<boolean>(false);
    const value = ref<string>('');

    const getCommentList = async () => {
      const result = await CommentApiService.getCommentByEntityId({
        entityId: entityId.value,
        entityType: entityType.value,
        pageIndex: 0,
        pageSize: 10
      });
      if (result.data) {
        comments.value = result.data.list;
      }
    };
    onMounted(async () => {
      await getCommentList();
    });
    const handleSubmit = async () => {
      if (!value.value) {
        return;
      }
      submitting.value = true;
      await CommentApiService.create({
        entityId: entityId.value,
        entityType: entityType.value,
        content: value.value
      });
      await getCommentList();
      submitting.value = false;
    };

    return {
      comments,
      submitting,
      value,
      handleSubmit,
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

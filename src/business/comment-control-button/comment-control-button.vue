<template>
  <social-action-button
    @total="isCommentDrawerShow = true"
    :title="'评论'"
    :total="count">
    <template #icon>
      <CommentOutlined/>
    </template>
  </social-action-button>
  <metagraph-drawer
    v-if="isCommentDrawerShow"
    :title="'评论详情'"
    :is-drawer-visible="isCommentDrawerShow"
    @visibleChange="handleCloseDrawer">
    <template #content>
      <entity-comment :entity-id="entityId" :entity-type="entityType"></entity-comment>
    </template>
  </metagraph-drawer>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { CommentOutlined } from '@ant-design/icons-vue';
import EntityComment from '@/business/entity-comment/entity-comment.vue';
import { SocialActionButton, MetagraphDrawer } from '@/components';

export default defineComponent({
  name: 'comment-control-button',
  components: {
    EntityComment,
    CommentOutlined,
    SocialActionButton,
    MetagraphDrawer
  },
  props: {
    count: {
      type: Number,
      required: true
    },
    entityType: {
      type: String,
      required: true
    },
    entityId: {
      type: String,
      required: true
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const isCommentDrawerShow = ref(false);
    const handleCloseDrawer = () => {
      isCommentDrawerShow.value = false;
      emit('update');
    };
    return {
      isCommentDrawerShow,
      handleCloseDrawer
    };
  }
});
</script>

<style scoped lang="scss">

</style>

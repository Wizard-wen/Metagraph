<template>
  <social-action-button
    @total="isCommentDrawerShow = true"
    :title="'评论'"
    :total="count">
    <template #icon>
      <comment-icon></comment-icon>
    </template>
  </social-action-button>
  <metagraph-drawer
    v-if="isCommentDrawerShow"
    :title="'评论详情'"
    :is-drawer-visible="isCommentDrawerShow"
    @visibleChange="isCommentDrawerShow = false">
    <template #content>
      <entity-comment :entity-id="entityId" :entity-type="entityType"></entity-comment>
    </template>
  </metagraph-drawer>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import EntityComment from '@/business/entity-comment/entity-comment.vue';
import { SocialActionButton, MetagraphDrawer, CommentIcon } from '@/components';

export default defineComponent({
  name: 'comment-control-button',
  components: {
    EntityComment,
    SocialActionButton,
    MetagraphDrawer,
    CommentIcon
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
  setup() {
    const isCommentDrawerShow = ref(false);
    return {
      isCommentDrawerShow
    };
  }
});
</script>

<style scoped lang="scss">

</style>

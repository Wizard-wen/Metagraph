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

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue';
import { CommentOutlined } from '@ant-design/icons-vue';
import EntityComment from '@/business/entity-comment/entity-comment.vue';
import { MetagraphDrawer, SocialActionButton } from '@/components';

defineProps({
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
  }
});
const emit = defineEmits(['update']);

const isCommentDrawerShow = ref(false);
const handleCloseDrawer = () => {
  isCommentDrawerShow.value = false;
  emit('update');
};

</script>

<style scoped lang="scss">

</style>

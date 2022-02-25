<template>
  <social-action-button
    @total="isCommentDrawerShow = true"
    :title="'被引'"
    :total="mentionedKnowledge.count">
    <template #icon>
      <comment-icon></comment-icon>
    </template>
  </social-action-button>
  <metagraph-drawer
    v-if="isCommentDrawerShow"
    :title="'被引用知识点列表'"
    :is-drawer-visible="isCommentDrawerShow"
    @visibleChange="isCommentDrawerShow = false">
    <template #content>
      <ant-list>
        <ant-list-item v-for="item in mentionedKnowledge.list">
            <template #actions>
              <ant-button @click="goProfilePage(item.entity.id)">查看</ant-button>
            </template>
            <ant-list-item-meta :description="item.author.name">
              <template #title>
                <div class="name" @click="goProfilePage(item.entity.id)">
                  {{ item.content.name }}
                </div>
              </template>
            </ant-list-item-meta>
          </ant-list-item>
      </ant-list>
    </template>
  </metagraph-drawer>
</template>

<script lang="ts">
import { Button, List } from 'ant-design-vue';
import { ref, defineComponent } from 'vue';
import { SocialActionButton, MetagraphDrawer, CommentIcon } from '@/components';
import { mentionedKnowledge } from '../model/knowledge.edit';

export default defineComponent({
  name: 'mentioned-control-button',
  components: {
    SocialActionButton,
    MetagraphDrawer,
    CommentIcon,
    AntListItemMeta: List.Item.Meta,
    AntListItem: List.Item,
    AntList: List,
    AntButton: Button,
  },
  setup() {
    const isCommentDrawerShow = ref(false);

    function goProfilePage(id: string) {
      // todo
    }

    return {
      isCommentDrawerShow,
      goProfilePage,
      mentionedKnowledge
    };
  }
});
</script>

<style scoped lang="scss">

</style>

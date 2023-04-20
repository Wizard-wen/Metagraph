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
        <ant-list-item v-for="(item, index) in mentionedKnowledge.list" :key="index">
          <template #actions>
            <ant-button @click="goPreviewPage(item.entity.id)">查看</ant-button>
          </template>
          <ant-list-item-meta :description="item.author.name">
            <template #title>
              <div class="name" @click="goPreviewPage(item.entity.id)">
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
import { EntityCompletelyListItemType } from '@metagraph/constant';
import { ref, defineComponent, PropType } from 'vue';
import { SocialActionButton, MetagraphDrawer, CommentIcon } from '@/components';
import { useRouter } from 'vue-router';

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
  props: {
    mentionedKnowledge: {
      type: Object as PropType<{
        count: number;
        list: EntityCompletelyListItemType[]
      }>,
      required: true
    }
  },
  setup() {
    const isCommentDrawerShow = ref(false);
    const router = useRouter();
    function goPreviewPage(id: string) {
      const { href } = router.resolve({
        path: '/knowledge/preview',
        query: {
          publishedKnowledgeEntityId: id
        }
      });
      window.open(href, '_blank');
    }

    return {
      isCommentDrawerShow,
      goPreviewPage
    };
  }
});
</script>

<style scoped lang="scss">

</style>

<template>
  <social-action-button
    @total="isStarDrawerShow = true"
    :title="'点赞'"
    :total="count">
    <template #icon>
      <star-icon></star-icon>
    </template>
  </social-action-button>
  <metagraph-drawer
    v-if="isStarDrawerShow"
    :title="'点赞详情'"
    :is-drawer-visible="isStarDrawerShow"
    @visibleChange="isStarDrawerShow = false">
    <template #content>
      <entity-star :entity-id="entityId" :entity-type="entityType"></entity-star>
    </template>
  </metagraph-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EntityStar from '@/business/entity-star/entity-star.vue';
import { StarIcon, MetagraphDrawer, SocialActionButton } from '../../components';

export default defineComponent({
  name: 'star-control-button',
  components: {
    EntityStar,
    SocialActionButton,
    MetagraphDrawer,
    StarIcon
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
    const isStarDrawerShow = ref(false);
    return {
      isStarDrawerShow
    };
  }
});
</script>

<style scoped>

</style>

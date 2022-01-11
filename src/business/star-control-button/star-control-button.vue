<template>
  <social-action-button
    @action="handleAction"
    @total="isStarDrawerShow = true"
    :title="hasStar ? '取消' : '点赞'"
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
import type { PublicEntityType } from 'metagraph-constant';
import {
  defineComponent, PropType, ref, toRef
} from 'vue';
import { message } from 'ant-design-vue';
import { StarApiService } from '@/api.service';
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
    isOwner: {
      type: Boolean
    },
    count: {
      type: Number,
      required: true
    },
    hasStar: {
      type: Boolean
    },
    entityType: {
      type: String as PropType<PublicEntityType>,
      required: true
    },
    entityId: {
      type: String,
      required: true
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const entityId = toRef(props, 'entityId');
    const isOwner = toRef(props, 'isOwner');
    const entityType = toRef(props, 'entityType');
    const hasStar = toRef(props, 'hasStar');
    const isStarDrawerShow = ref(false);

    async function handleAction() {
      if (!isOwner.value) {
        return;
      }
      let result;
      let type;
      if (hasStar.value) {
        result = await StarApiService.cancel({
          entityId: entityId.value,
          entityType: entityType.value
        });
        type = '取消点赞成功';
        emit('update', 'cancel');
      } else {
        result = await StarApiService.create({
          entityId: entityId.value,
          entityType: entityType.value
        });
        type = '点赞成功';
        emit('update', 'add');
      }
      if (result.code === 0) {
        message.success(type);
      }
    }

    return {
      isStarDrawerShow,
      handleAction
    };
  }
});
</script>

<style scoped>

</style>

<template>
  <social-action-button
    @action="handleAction"
    @total="isStarDrawerShow = true"
    :title="hasStar ? '取消' : '点赞'"
    :total="count">
    <template #icon>
      <StarOutlined v-if="!hasStar"/>
      <StarFilled class="high-icon-style" v-else/>
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

<script lang="ts" setup>
import type { PublicEntityType } from '@metagraph/constant';
import { defineEmits, defineProps, PropType, ref } from 'vue';
import { message } from 'ant-design-vue';
import { StarFilled, StarOutlined } from '@ant-design/icons-vue';
import { StarApiService } from '@/api-service';
import EntityStar from '@/business/entity-star/entity-star.vue';
import { MetagraphDrawer, SocialActionButton } from '@/components';

const props = defineProps({
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
});
const emit = defineEmits(['update']);
const isStarDrawerShow = ref(false);

async function handleAction() {
  if (!props.isOwner) {
    return;
  }
  let result;
  let type;
  if (props.hasStar) {
    result = await StarApiService.cancel({
      entityId: props.entityId,
      entityType: props.entityType
    });
    type = '取消点赞成功';
    emit('update', 'cancel');
  } else {
    result = await StarApiService.create({
      entityId: props.entityId,
      entityType: props.entityType
    });
    type = '点赞成功';
    emit('update', 'add');
  }
  if (result.code === 0) {
    message.success(type);
  }
}

</script>

<style scoped lang="scss">
@import "../../style/common.scss";
.high-icon-style {
  color: $starHighlight;
}
</style>

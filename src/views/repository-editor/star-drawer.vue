<template>
  <ant-drawer
    :width="600"
    title="点赞"
    placement="right"
    :closable="false"
    v-model:visible="visible"
    :after-visible-change="afterVisibleChange"
  >
    <ant-list>
      <ant-list-item v-for="item in starList">
        <template #actions>
          <ant-button>follow</ant-button>
        </template>
        <ant-list-item-meta :description="item.email">
          <template #title>
            <div class="name" @click="goProfilePage(item.id)">{{ item.name }}</div>
          </template>
          <template #avatar>
            <ant-avatar v-if="item.avatar" :src="item.avatar"/>
            <div class="icon" v-else></div>
          </template>
        </ant-list-item-meta>
      </ant-list-item>
    </ant-list>
    <div>
    </div>
  </ant-drawer>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, ref, toRefs, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { StarApiService } from '@/api.service';
import Comment from '../../business/entity-comment/entity-comment.vue';

export default defineComponent({
  name: 'star-drawer',
  components: {
    // Comment
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    entityId: {
      type: String,
      required: true
    },
  },
  setup(props, context) {
    const { entityId, isShow } = toRefs(props);
    const visible = ref<boolean>(false);
    const router = useRouter();
    watch(isShow, async (newValue, oldValue) => {
      if (newValue) {
        visible.value = newValue;
      }
    });
    const afterVisibleChange = (bool: boolean) => {
      context.emit('showChange', false);
    };
    const starList = ref<any[]>([]);

    async function getStarDetailList() {
      const result = await StarApiService.getEntityStarList({
        entityType: 'Repository',
        entityId: entityId.value,
        pageIndex: 0,
        pageSize: 100
      });
      if (result.data) {
        starList.value = result.data.user.list;
      }
    }

    async function goProfilePage(id: string) {
      router.push({
        path: '/profile',
        query: {
          id
        }
      }).then();
    }

    onMounted(async () => {
      await getStarDetailList();
    });

    return {
      afterVisibleChange,
      visible,
      starList,
      goProfilePage
    };
  },
});
</script>

<style scoped lang="scss">
.name {
  cursor: pointer;
}

.icon {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: #f5f5f5;
}
</style>

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
import { Drawer, List, Button, Avatar } from 'ant-design-vue';
import type { UserModelType } from 'metagraph-constant';
import {
  defineComponent, onMounted, ref, toRefs, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { StarApiService } from '@/api.service';

export default defineComponent({
  name: 'star-drawer',
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
  components: {
    AntListItemMeta: List.Item.Meta,
    AntListItem: List.Item,
    AntList: List,
    AntButton: Button,
    AntDrawer: Drawer,
    AntAvatar: Avatar
  },
  setup(props, context) {
    const { entityId, isShow } = toRefs(props);
    const visible = ref<boolean>(false);
    const router = useRouter();
    watch(isShow, async (newValue) => {
      if (newValue) {
        visible.value = newValue;
      }
    });
    const afterVisibleChange = () => {
      context.emit('showChange', false);
    };
    const starList = ref<UserModelType[]>([]);

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

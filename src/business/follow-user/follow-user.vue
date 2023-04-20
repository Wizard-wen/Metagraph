<template>
  <ant-list>
    <ant-list-item v-for="(item, index) in userList" :key="index">
      <template #actions>
        <ant-button @click="goProfilePage(item.id)">查看</ant-button>
      </template>
      <ant-list-item-meta :description="item.email" style="text-align: left">
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
</template>

<script lang="ts">
import { Avatar, Button, List } from 'ant-design-vue';
import type { UserModelType } from '@metagraph/constant';
import {
  defineComponent, PropType
} from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'follow-user',
  props: {
    userList: {
      type: Array as PropType<UserModelType[]>,
      required: true
    },
  },
  components: {
    AntButton: Button,
    AntAvatar: Avatar,
    AntList: List,
    AntListItem: List.Item,
    AntListItemMeta: List.Item.Meta
  },
  setup() {
    const router = useRouter();

    async function goProfilePage(id: string) {
      router.push({
        path: '/profile',
        query: {
          id
        }
      }).then();
    }

    return {
      goProfilePage
    };
  }
});
</script>

<style scoped lang="scss">
.load-more-button {
  text-align: center;
  margin-top: 12px;
  height: 32px;
  line-height: 32px;
}

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

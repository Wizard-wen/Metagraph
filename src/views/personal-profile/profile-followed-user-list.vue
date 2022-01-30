<template>
  <follow-user :user-list="followList.followedUserList"></follow-user>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import FollowUser from '@/business/follow-user/follow-user.vue';
import { followList } from './personal.profile';

export default defineComponent({
  name: 'profile-followed-user-list',
  components: { FollowUser },
  setup() {
    return {
      followList
    };
  }
});
</script>

<style scoped>

</style>

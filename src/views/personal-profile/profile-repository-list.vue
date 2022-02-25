<template>
  <template v-if="myRepositoryEntityList.target.length">
    <repository-list-item
      :repository="item"
      :key="index"
      v-for="(item, index) in myRepositoryEntityList.target"></repository-list-item>
  </template>

</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import RepositoryListItem from '@/github.style.component/repository-list-item/repository-list-item.vue';
import { myRepositoryEntityList } from './personal.profile';

export default defineComponent({
  name: 'profile-repository-list',
  components: { RepositoryListItem },
  setup() {
    return {
      myRepositoryEntityList
    };
  }
});
</script>

<style scoped>

</style>

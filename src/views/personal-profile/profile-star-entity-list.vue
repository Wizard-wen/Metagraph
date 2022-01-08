<template>
  <template v-for="item in myStaredEntityList.target">
    <template v-if="item.entity.entityType === 'Repository'">
      <repository-list-item :repository="item"></repository-list-item>
    </template>
    <template v-if="item.entity.entityType === 'Knowledge'">
      <knowledge-list-item :repository="item"></knowledge-list-item>
    </template>
  </template>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import RepositoryListItem from '@/github.style.component/repository-list-item/repository-list-item.vue';
import KnowledgeListItem from '@/github.style.component/knowledge-list-item/knowledge-list-item.vue';
import { myStaredEntityList } from './personal.profile';

export default defineComponent({
  name: 'profile-star-entity-list',
  components: { RepositoryListItem, KnowledgeListItem },
  setup() {
    return {
      myStaredEntityList
    };
  }
});
</script>

<style scoped>

</style>

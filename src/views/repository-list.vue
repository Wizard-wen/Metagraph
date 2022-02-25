<template>
  <div class="repository-list">
    <repo-list></repo-list>
  </div>
</template>

<script lang="ts">
// import { RepositoryApiService } from "@/api.service";
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import RepoList from './repository-list/repo-list.vue';

export default defineComponent({
  name: 'repository-list',
  components: {
    RepoList
  },
  setup() {
    const route = useRoute();
    const queryName = ref(route.query.name as string);
    // const current = ref(0);
    // const total = ref(0);
    // const result = await RepositoryApiService.getRepositoryList({
    //   pageIndex: 0,
    //   pageSize: 10,
    //   name: queryName.value
    // });
    return {};
  }
});
</script>

<style scoped lang="scss">

</style>

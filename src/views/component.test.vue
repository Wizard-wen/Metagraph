<template>
  <!--  <repository-list-item></repository-list-item>-->
  <div style="width: 500px;">
    <search-input></search-input>
  </div>
<!--  <div v-clickoutside="'jjjjjj'" class="ele">-->

<!--  </div>-->
  <div style="width: 300px;">
    <animation-input></animation-input>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RepositoryListItem from '@/github.style.component/repository.list.item/repository-list-item.vue';
import SearchInput from '@/github.style.component/search-input/git-style-input-search.vue';
import { clickoutside } from '@/directives/click.outside';
import AnimationInput from '@/github.style.component/search-input/input-animation.vue';
export default defineComponent({
  name: 'component.test',
  components: {
    // RepositoryListItem,
    SearchInput,
    AnimationInput
  },
  directives: {
    clickoutside
  }
});
</script>

<style scoped lang="scss">
.ele {
  height: 120px;
  width: 120px;
  background: red;
}
</style>

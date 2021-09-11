<template>

  <div class="edge-box">
    <EntityTag :knowledge="knowledgeList[0]" :knowledge-type="'Pre'"></EntityTag>
    <EntityTag :knowledge="knowledgeList[1]" :knowledge-type="'Pre'"></EntityTag>
    <EntityTag :knowledge="knowledgeList[2]" :knowledge-type="'Current'"></EntityTag>
    <EntityTag :knowledge="knowledgeList[3]" :knowledge-type="'After'"></EntityTag>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import EntityTag from './entity.tag.vue';

export default defineComponent({
  components: {
    EntityTag
  },
  setup() {
    const a = ref('knowledge');
    const knowledgeList = reactive([
      { name: 'EventTarget', star: 340, comment: 135 },
      { name: 'Event', star: 309, comment: 55 },
      { name: 'MouseEvent', star: 610, comment: 35 },
      { name: 'MouseInputEvent', star: 710, comment: 20 }
    ]);
    return {
      a,
      knowledgeList
    };
  }
});
</script>

<style lang="scss" scoped>
@import '../../../../style/common';

.edge-box {
}
</style>

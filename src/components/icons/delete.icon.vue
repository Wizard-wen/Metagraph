<template>
  <Icon>
    <template #component>
      <svg viewBox="0 0 1024 1024" fill="currentColor" width="1em" height="1em">
        <path
          d="M320 832a32 32 0 0 0 32-32V448a32 32 0 1 0-64 0v352a32 32 0 0 0 32 32z m192 0a32 32 0 0 0 32-32V448a32 32 0 1 0-64 0v352a32 32 0 0 0 32 32z m192 0a32 32 0 0 0 32-32V448a32 32 0 0 0-64 0v352a32 32 0 0 0 32 32zM864 96H731.443A128 128 0 0 0 608 0H416a128 128 0 0 0-123.494 96H160A128 128 0 0 0 32 224v32h32v32h64v608a128 128 0 0 0 128 128h512a128 128 0 0 0 128-128V288h64v-32h32v-32A128 128 0 0 0 864 96zM416 64h192a63.795 63.795 0 0 1 55.091 32h-302.08A63.795 63.795 0 0 1 416 64z m416 832a64.051 64.051 0 0 1-64 64H256c-35.277 0-68.454-28.672-68.454-64L192 288h640v608zM96 224a64.051 64.051 0 0 1 64-64h704a64.051 64.051 0 0 1 64 64z"
          ></path>
      </svg>

    </template>
  </Icon>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    Icon
  }
});
</script>

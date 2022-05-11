<template>
  <Icon>
    <template #component>
      <svg viewBox="0 0 1024 1024" fill="currentColor" width="1em" height="1em">
        <path
          d="M928 0H288c-53.02 0-96 42.98-96 96v96H96c-53.02 0-96 42.98-96 96v640c0 53.02 42.98 96 96 96h640c53.02 0 96-42.98 96-96v-96h96c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96zM724 928H108a12 12 0 0 1-12-12V300a12 12 0 0 1 12-12h84v448c0 53.02 42.98 96 96 96h448v84a12 12 0 0 1-12 12z m192-192H300a12 12 0 0 1-12-12V108a12 12 0 0 1 12-12h616a12 12 0 0 1 12 12v616a12 12 0 0 1-12 12z"
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

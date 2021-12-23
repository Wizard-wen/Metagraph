<template>
  <Icon>
    <template #component>
      <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
        <path
          d="M832 128H640v64h146.752L521.376 457.376l45.248 45.248L832 237.248V384h64V128z"></path>
        <path
          d="M768 832H192V256h352v-64H160a32 32 0 0 0-32 32v640a32 32 0 0 0 32 32h640a32 32 0 0 0 32-32V480h-64v352z"></path>
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

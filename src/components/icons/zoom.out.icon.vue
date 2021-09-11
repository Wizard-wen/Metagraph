<template>
  <Icon>
    <template #component>
      <svg viewBox="0 0 1024 1024" fill="currentColor" width="1em" height="1em">
        <path
          d="M872.3 899.1h-718c-14.3 0-26-11.7-26-26v-718c0-14.3 11.7-26 26-26h718c14.3 0 26 11.7 26 26v718c0 14.3-11.6 26-26 26z m-711.9-32h706v-706h-706v706z"
        ></path>
        <path
          d="M487.4 488.6l-166.1-0.2c-8.8 0-16-7.2-16-16s7.2-16 16-16l134.1 0.1 0.1-134.1c0-8.8 7.2-16 16-16s16 7.2 16 16l-0.1 166.2z"
        ></path>
        <path
          d="M438.5 461.1L256 278.6c-6.2-6.2-6.2-16.4 0-22.6 6.2-6.2 16.4-6.2 22.6 0l182.5 182.5c6.2 6.2 6.2 16.4 0 22.6-6.3 6.2-16.4 6.2-22.6 0zM553.2 719.7c-8.8 0-16-7.2-16-16l0.2-166.1 166.1 0.2c8.8 0 16 7.2 16 16s-7.2 16-16 16l-134.1-0.1-0.1 134.1c-0.1 8.8-7.3 15.9-16.1 15.9z"
        ></path>
        <path d="M745.2 767.9L548.5 572.6l22.5-22.7 196.7 195.3c6.3 6.2 6.3 16.4 0.1 22.6-6.2 6.3-16.4 6.3-22.6 0.1z"
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

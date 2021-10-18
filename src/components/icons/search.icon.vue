<template>
  <Icon>
    <template #component>
      <svg viewBox="0 0 1024 1024" fill="currentColor" width="1em" height="1em">
        <path
          d="M480 746.666667A266.666667 266.666667 0 1 1 746.666667 480 267.093333 267.093333 0 0 1 480 746.666667z m0-490.666667A224 224 0 1 0 704 480 224.213333 224.213333 0 0 0 480 256z"
        ></path>
        <path d="M638.570667 661.141333l24.576-24.576 147.541333 147.52-24.597333 24.597334z"></path>
        <path
          d="M786.133333 812.373333L634.666667 661.333333l28.373333-28.373333 151.466667 151.253333zM642.133333 661.333333l144 143.786667 21.333334-21.333333L663.04 640z"
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

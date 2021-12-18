<template>
  <Icon>
    <template #component>
      <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
        <path d="M379.01 256L231.35 511.75l0.05 0.03c-10.97 18.88-17.26 40.81-17.26 64.22 0 70.69 57.31 128 128 128s128-57.31 128-128c0-58.85-39.72-108.42-93.81-123.37L489.86 256H379.01zM696.34 452.63L809.86 256H699.01L551.35 511.75l0.05 0.03c-10.97 18.88-17.26 40.81-17.26 64.22 0 70.69 57.31 128 128 128s128-57.31 128-128c0-58.85-39.71-108.42-93.8-123.37z"
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

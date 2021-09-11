<template>
  <Icon>
    <template #component>
      <svg viewBox="0 0 1024 1024" fill="currentColor" width="1em" height="1em">
        <path
          d="M845.312 0.512H32.512v1022.976h958.976v-876.8L845.312 0.512z m-172.864 62.976v256H351.488v-256h320.96zM287.488 960.512V605.76l29.184-29.248h390.656l29.184 29.248v354.752H287.488z m640 0h-126.976V585.152L727.424 512H296.576L223.488 585.152v375.36H96.512V63.488h190.976v320.448h449.024V63.488h79.68l111.296 112.32v784.704z m-384-832h65.984v128H543.488v-128z"
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

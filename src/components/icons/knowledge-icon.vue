<template>
  <Icon>
    <template #component>
      <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
        <path d="M249.8 280.2h145v51.2h-145zM249.8 380.6h96v51.2h-96z"></path>
        <path
          d="M894.2 157.4H608c-38.1 0-72.3 16.8-95.8 43.2-23.4-26.5-57.7-43.2-95.8-43.2H162.3l-33.2 1.2V782l1.2 33.2h286.2c19 0 36.8 8.4 49 23 11.6 13.9 28.6 21.8 46.7 21.8 18.2 0 35.2-7.9 46.8-21.8 12.1-14.6 30-23 49-23h254.2l33.2-1.2V190.6l-1.2-33.2z m-62.9 593.8H608c-36.8 0-71.5 15.7-95.8 43.2-24.3-27.5-59-43.2-95.8-43.2H193.2V221.4h223.3c33.5 0 60.7 26 63.2 58.8v441.9h64V285.2h0.5c0-35.2 28.6-63.7 63.7-63.7h223.3v529.7z"
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

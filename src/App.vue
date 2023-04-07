<template>
  <config-provider>
    <router-view/>
  </config-provider>

</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { ConfigProvider } from 'ant-design-vue';

const colorState = reactive({
  primaryColor: '#00B96B',
  errorColor: '#ff4d4f',
  warningColor: '#faad14',
  successColor: '#52c41a',
  infoColor: '#00B96B',
});
ConfigProvider.config({
  theme: colorState,
});

</script>
<style lang="scss">
#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

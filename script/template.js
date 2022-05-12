/**
 * @author wizard
 * @date 2021/09/20
 * @description 组件生成器
 */

module.exports = {
  vueTemplate: (componentName) => `<template>
  <div class="${componentName}">
    ${componentName}组件
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
export default defineComponent({
  name: '${componentName}',
  setup(){

  }
})
</script>
<style lang="scss" scoped>
.${componentName} {

}
</style>
`,
  entryTemplate: `import Main from './main.vue'
export default Main`
};

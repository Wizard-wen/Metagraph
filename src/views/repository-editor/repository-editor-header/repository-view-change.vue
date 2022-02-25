<template>
  <ant-switch
    :unCheckedChildren="'图谱视图'"
    :checkedChildren="'单元视图'"
    @change="handleChangeView"
    :checked="viewStatus === 'section'"/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Switch } from 'ant-design-vue';

export default defineComponent({
  name: 'repository-view-change',
  components: {
    AntSwitch: Switch
  },
  props: {
    viewStatus: {
      type: String as PropType<'section' | 'graph'>,
      required: true
    }
  },
  emits: ['viewChange'],
  setup(props, { emit }) {
    const handleChangeView = (status: boolean) => {
      // status是切换后的状态
      emit('viewChange', status ? 'section' : 'graph');
    };
    return {
      handleChangeView
    };
  }
});
</script>

<style scoped lang="scss">

</style>

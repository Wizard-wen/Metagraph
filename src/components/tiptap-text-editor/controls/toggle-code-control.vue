<template>
  <div class="operation-icon" @click="toggleCode">
    <div class="icon">
      <code-icon
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('codeBlock') }"/>
    </div>
    <div class="name">
      代码段
    </div>
  </div>
</template>

<script lang="ts">
import { Editor } from '@tiptap/vue-3';
import {
  PropType, defineComponent, toRef
} from 'vue';
import { CodeIcon } from '@/components/icons';

export default defineComponent({
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    }
  },
  components: { CodeIcon },
  setup(props) {
    const editor = toRef(props, 'editor');
    function toggleCode() {
      editor.value?.chain()
        .focus()
        .toggleCodeBlock()
        .run();
    }

    return {
      toggleCode
    };
  }
});

</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>

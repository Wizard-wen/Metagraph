<template>
  <button @click="addComponent">add</button>
  <editor-content :editor="editor" class="tip-tap-editor"/>
</template>

<script lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import {
  defineComponent, ref, onMounted, onUnmounted
} from 'vue';
import { CustomTestMention } from '@/test.components/tiptap-demo/custom-tiptap-node/custom.mention';
import VueComponent from '@/test.components/tiptap-demo/custom-tiptap-node/extention';

export default defineComponent({
  name: 'test-tiptap',
  components: {
    EditorContent,
  },

  setup() {
    const editor = ref();
    onMounted(() => {
      editor.value = new Editor({
        extensions: [
          StarterKit,
          VueComponent,
          CustomTestMention
        ],
        content: `
        <p>
          This is still the text editor you’re used to, but enriched with node views.
        </p>
        <vue-component count="2222"></vue-component>
        <p>
          Did you see that? That’s a Vue component. We are really living in the future.
        </p>
      `,
      });
    });
    const addComponent = () => {
      editor.value.commands.insertContent('<vue-component><p>aaaaaaaaa</p></vue-component>');
    };
    onUnmounted(() => {
      editor.value.destroy();
    });
    return {
      editor,
      addComponent
    };
  }
});
</script>

<style lang="scss" scoped>
@import '../../../style/tiptap.common.scss';
</style>

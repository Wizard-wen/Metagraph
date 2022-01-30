<template>
  <node-view-wrapper class="code-block">
    <select contenteditable="false" v-model="selectedLanguage">
      <option :value="null">
        auto
      </option>
      <option disabled>
        —
      </option>
      <option v-for="(language, index) in languages" :value="language" :key="index">
        {{ language }}
      </option>
    </select>
    <pre><code><node-view-content/></code></pre>
  </node-view-wrapper>
</template>

<script lang="ts">
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3';
import { defineComponent, toRefs, computed } from 'vue';

export default defineComponent({
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },
  props: nodeViewProps,
  setup(props) {
    const {
      extension,
      node,
      updateAttributes
    } = toRefs(props);
    const languages = extension.value?.options.lowlight.listLanguages();
    const selectedLanguage = computed({
      get() {
        return node.value?.attrs.language;
      },
      set(language) {
        if (updateAttributes.value) {
          updateAttributes.value({ language });
        }
      },
    });
    return {
      languages,
      selectedLanguage
    };
  },
});
</script>

<style lang="scss" scoped>
.code-block {
  position: relative;

  select {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>

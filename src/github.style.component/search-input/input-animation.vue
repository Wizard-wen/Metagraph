<template>
  <input
    type="text"
    class="input"
    :class="{'input-extend': isClass}"
    placeholder="search "
    @focus="hasClass"
    @blur="hasClass">
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'input-animation',
  setup() {
    const isClass = ref(false);

    function hasClass() {
      console.log('trigger');
      isClass.value = !isClass.value;
    }

    return {
      hasClass,
      isClass
    };
  }
});
</script>

<style scoped lang="scss">
.input {
  display: block;
  height: 30px;
  width: 100%;
  border: 1px solid black;
  padding: 0 12px;
  margin: 0;
  transition: width .3s;
}

.input-extend {
  width: 500px;
}

@keyframes input-extend {
  from {
    width: 272px;
  }
  to {
    width: 500px;
  }
}
</style>

<script lang="tsx">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'tsx-demo',
  setup() {
    const data = ref('text data');
    return (
      <div>{data}</div>
    );
  }
});
</script>

<style scoped>

</style>

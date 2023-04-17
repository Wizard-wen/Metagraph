<template>
  <ant-alert
    v-if="isNetworkError"
    message="您的网络环境不稳定!" type="error"></ant-alert>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { Alert, notification } from 'ant-design-vue';

export default defineComponent({
  name: 'network-status-alert',
  components: {
    AntAlert: Alert
  },
  setup() {
    const isNetworkError = ref(false);

    function updateOnlineStatus(event: Event) {
      const condition = navigator.onLine ? 'online' : 'offline';
      if (event.type === 'online') {
        notification.success({
          message: '网络状况提示',
          description:
            '您的网络环境已恢复',
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
        console.log(`Event: ${event.type}; Status: ${condition}`);
      } else {
        console.log(`Event: ${event.type}; Status: ${condition}`);
      }
      console.log(condition.toUpperCase());
      isNetworkError.value = condition === 'offline';
    }

    onMounted(() => {
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    });

    onUnmounted(() => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    });

    return {
      isNetworkError
    };
  }
});
</script>

<style scoped lang="scss">

</style>

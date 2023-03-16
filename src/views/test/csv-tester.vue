<template>
  <input type="file" @change="handleFileChange($event)">
</template>

<script lang="ts" setup>
import { parse } from 'csv-parse';

function handleFileChange(event: Event) {
  const fileElement = event.target as HTMLInputElement;
  const { files } = fileElement;
  if (files) {
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (data) => {
      console.log(data, files[0]);
      parse(data.target?.result as string, {
        info: true,
        skip_records_with_error: true,
        // 最大支持解析10000行
        to_line: 10000
      }, (error, data) => {
        console.log(error, data);
      });
    };
  }
}
</script>

<style scoped lang="scss">

</style>

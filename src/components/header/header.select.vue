<template>
<!--  <ant-select-->
<!--    v-model="value"-->
<!--    show-search-->
<!--    placeholder="input search text"-->
<!--    style="width: 200px"-->
<!--    :default-active-first-option="false"-->
<!--    :show-arrow="false"-->
<!--    :filter-option="false"-->
<!--    :not-found-content="null"-->
<!--    option-label-prop="label"-->
<!--    @blur="handleBlur"-->
<!--    @inputKeyDown="handleInput"-->
<!--    @search="fetchUser">-->
<!--    <template v-for="item in queryedRepositoryList">-->
<!--      <ant-select-option-->
<!--        :label="item.entity.name"-->
<!--        :value="item.entity.id">{{ item.entity.name }}-->
<!--      </ant-select-option>-->
<!--    </template>-->
<!--  </ant-select>-->
  <ant-input v-model:value="value"></ant-input><ant-button ></ant-button>
</template>

<script lang="ts">
import { RepositoryApiService } from '@/api.service';
import {
  computed,
  defineComponent, reactive, toRefs, ref
} from 'vue';
import { debounce } from 'lodash';
import { ActionEnum, useStore } from '@/store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'header.select',
  setup() {
    const router = useRouter();

    const value = ref('');

    const queryedRepositoryList = ref<any[]>([]);

    const fetchUser = async (newValue: any) => {
      console.log('new value --- ', newValue);
      value.value = newValue;
      console.log('v-model value --- ', value.value);
      const result = await RepositoryApiService.getRepositoryList({
        pageIndex: 0,
        pageSize: 10,
        name: newValue
      });
      queryedRepositoryList.value = result.data?.list ?? [];
    };

    // watch(state.value, () => {
    //   state.data = [];
    //   state.fetching = false;
    // });

    const handleInput = async (event: KeyboardEvent) => {
      console.log(value.value, ' ---- value');
      if (event.key === 'Enter') {
        await router.push({
          name: 'RepositoryList',
          params: {
            name: value.value
          }
        });
      }
    };

    const handleBlur = (event: any) => {
      console.log(event);
    };

    return {
      fetchUser,
      queryedRepositoryList,
      value,
      handleInput,
      handleBlur
    };
  },
});
</script>

<style scoped>

</style>

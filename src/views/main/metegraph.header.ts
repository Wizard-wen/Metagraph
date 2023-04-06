import { ref } from 'vue';

/**
 * @author songxiwen
 * @date  2022/5/12 20:32
 */

export const searchData = ref({
  text: '',
  type: '',
  pageSize: 10,
  pageIndex: 0
});

/**
 * @author songxiwen
 * @date  2021/10/27 22:05
 */
import { Directive } from 'vue';

export const clickOutside: Directive<any, { expression: any }> = {
  // 初始化指令
  mounted(el, binding, vNode) {
    console.log(typeof el, binding, vNode);

    function documentHandler(e: any): any {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        console.log('in');
        return false;
      }
      console.log('out');
      return false;
    }

    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  unmounted(el: any, binding: any) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__);
  },
};

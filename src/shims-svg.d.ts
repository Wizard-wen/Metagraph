/**
 * @author songxiwen
 * @date  2021/9/1 22:40
 */

declare module '*.svg' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent;
  export default component;
}

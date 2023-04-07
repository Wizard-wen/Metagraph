import { Form } from 'ant-design-vue';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $form: typeof Form;
    // $validate: (data: object, rule: object) => boolean
  }
}

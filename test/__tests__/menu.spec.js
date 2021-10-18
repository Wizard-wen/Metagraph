import { mount } from '@vue/test-utils';
import Component from '../../src/github.style.component/router-menu-list/router-menu-list.vue';

describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Component);
    expect(wrapper.isVueInstance())
      .toBeTruthy();
  });
});

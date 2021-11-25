import { mount, shallowMount, RouterLinkStub } from '@vue/test-utils';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import RouterMenuList from '@/github.style.component/router-menu-list/router-menu-list.vue';

const router = createRouter({
  history: createWebHashHistory('/'),
  routes: [
    { name: 'home', path: '/', redirect: '/' },
    { name: 'test', path: '/abc', redirect: '' },
  ]
});
describe('Component', () => {
  test('is a Vue instance', async () => {
    await router.push('/abc');

    // After this line, router is ready
    await router.isReady();
    const wrapper = mount(RouterMenuList, {
      props: {
        navList: [{
          path: '/abc', name: 'test'
        }],
        title: 'abc'
      },
      global: {
        plugins: [router]
      }
    });
    expect(wrapper.props('title')).toBe('abc');
  });
});

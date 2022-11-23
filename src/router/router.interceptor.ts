/**
 * @author songxiwen
 * @date  2022/5/10 13:37
 */
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { store } from '@/store';
import router from './index';

router.beforeEach(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // if (to.query) {
  //   next({
  //     path: to.path,
  //     query: {
  //       ...to.query
  //     }
  //   });
  // }

  if (to.meta.requiresAuth && !store.state.user.isLogin) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    next({
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

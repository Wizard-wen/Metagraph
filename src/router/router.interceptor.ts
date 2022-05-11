/**
 * @author songxiwen
 * @date  2022/5/10 13:37
 */
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import router from './index';

router.beforeEach(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (to.query) {
    next({
      path: to.path,
      query: {
        ...to.query
      }
    });
  }
});

/**
 * @author wizard.song
 * @date 2021/09/15 00:15
 */

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { CryptoUtil } from '@/utils/crypto-util';
import Main from '../views/main.vue';
import Settings from '../views/settings.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/first',
    name: 'FirstPage',
    component: () => import('@/views/first-page.vue'),
  },
  {
    path: '/',
    redirect: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '',
        component: () => import('@/views/home-page.vue')
      },
      {
        path: '/repository/list',
        name: 'RepositoryList',
        component: () => import('@/views/repository-list.vue')
      },
      {
        path: '/repository/edit',
        name: 'RepositoryEdit',
        component: () => import('@/views/repository-edit.vue')
      },
      {
        path: 'profile',
        name: 'PersonalProfile',
        component: () => import('@/views/personal-profile.vue')
      },
      {
        path: 'planList',
        name: 'PlanList',
        component: () => import('@/views/plan/plan-list.vue'),
        meta: { requiresAuth: true }
      },

      {
        path: 'inspiration',
        name: 'inspiration',
        component: () => import('@/views/inspiration.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        children: [
          {
            path: 'profile',
            name: 'Profile',
            component: () => import('@/views/settings/profile.vue')
          },
          {
            path: 'security',
            name: 'security',
            component: () => import('@/views/settings/security.vue')
          },
          {
            path: 'bindEmail',
            name: 'bindEmail',
            component: () => import('@/views/settings/bind-email.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/planBoard',
    name: 'planBoard',
    component: () => import('@/views/plan/plan-board.vue')
  },
  {
    path: '/studyBoard',
    name: 'studyBoard',
    component: () => import('@/views/plan/plan-study-board.vue')
  },
  {
    path: '/repository/editor',
    name: 'RepositoryEditor',
    component: () => import('@/views/repository-editor.vue'),
    beforeEnter: (to, from) => {
      // 解密路由参数
      const { iv, key } = CryptoUtil.generateAesKeys('123', '456');
      const result = CryptoUtil.decrypt(<string>to.query?.t ?? '', { iv, key });
      to.query = {
        ...to.query,
        ...JSON.parse(result)
      };
      return true;
    }
  },
  {
    path: '/knowledge/map',
    name: 'KnowledgeMap',
    component: () => import('@/views/knowledge-map.vue')
  },
  {
    path: '/knowledge/edit',
    name: 'KnowledgeEdit',
    component: () => import('@/views/knowledge-edit.vue')
  },

  {
    path: '/knowledge/preview',
    name: 'KnowledgePreview',
    component: () => import('@/views/knowledge-preview.page.vue'),
    beforeEnter: (to, from) => {
      // 解密路由参数
      const { iv, key } = CryptoUtil.generateAesKeys('123', '456');
      const result = CryptoUtil.decrypt(<string>to.query?.t ?? '', { iv, key });
      to.query = {
        ...to.query,
        ...JSON.parse(result)
      };
      return true;
    }
    ,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/views/sign-up.vue')
  },
  {
    path: '/signupByEmail',
    name: 'SignUpByEmail',
    component: () => import('@/views/sign-up/sign-up-by-email.vue')
  },
  {
    path: '/test',
    name: 'ComponentTest',
    component: () => import('@/views/component-test.vue')
  },
];

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
});

export default router;

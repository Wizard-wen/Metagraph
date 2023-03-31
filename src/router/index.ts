/**
 * @author wizard.song
 * @date 2021/09/15 00:15
 */

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
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
        path: '/search/list',
        name: 'RepositoryList',
        component: () => import('@/views/search-list.vue')
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
        path: 'plan/list',
        name: 'PlanList',
        component: () => import('@/views/plan/plan-list.vue'),
        meta: { requiresAuth: true }
      },

      {
        path: 'inspiration',
        name: 'inspiration',
        component: () => import('@/views/inspiration.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: () => import('@/views/feedback.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('@/views/help.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: { requiresAuth: true },
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
    path: '/plan/board',
    name: 'planBoard',
    component: () => import('@/views/plan/plan-board.vue')
  },
  {
    path: '/study/board',
    name: 'studyBoard',
    component: () => import('@/views/plan/plan-study-board.vue')
  },
  {
    path: '/repository/editor',
    name: 'RepositoryEditor',
    component: () => import('@/views/repository-editor.vue'),
  },
  {
    path: '/knowledge/map',
    name: 'KnowledgeMap',
    component: () => import('@/views/knowledge-map.vue')
  },
  {
    path: '/knowledge/edit',
    name: 'KnowledgeEdit',
    component: () => import('@/views/knowledge-editor.vue')
  },

  {
    path: '/knowledge/preview',
    name: 'KnowledgePreview',
    component: () => import('@/views/knowledge-preview.vue'),
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
    path: '/signup/email',
    name: 'SignUpByEmail',
    component: () => import('@/views/sign-up/sign-up-by-email.vue')
  },
  {
    path: '/test',
    name: 'ComponentTest',
    component: () => import('@/views/component-test.vue')
  },
  {
    path: '/home/no/auth',
    name: 'NoAuthHomePage',
    component: () => import('@/views/no-auth-home-page.vue')
  },
];

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
});

export default router;

/**
 * @author wizard.song
 * @date 2021/09/15 00:15
 */

import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Main from '../views/main.vue';
import Settings from '../views/settings.vue';
import Repository from '../views/repository.vue';

const routes: Array<RouteRecordRaw> = [
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
        path: 'repo',
        component: Repository
      },
      {
        path: '/repository/list',
        name: 'RepositoryList',
        component: () => import('@/views/repository-list.vue')
      },
      {
        path: '/repository/edit',
        name: 'CreateRepository',
        component: () => import('@/views/repository-edit.vue')
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/personal-profile.vue')
      },
      {
        path: 'planList',
        name: 'PlanList',
        component: () => import('@/views/plan/plan-list.vue')
      },
      {
        path: 'planBoard',
        name: 'planBoard',
        component: () => import('@/views/plan/plan-board.vue')
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
    path: '/repository/editor',
    name: 'RepositoryEditor',
    component: () => import('@/views/repository-editor.vue')
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

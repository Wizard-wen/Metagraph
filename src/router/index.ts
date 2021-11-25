/**
 * @author wizard.song
 * @date 2021/09/15 00:15
 */

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
        component: () => import('@/views/home.page.vue')
      },
      {
        path: 'repo',
        component: Repository
      },
      {
        path: 'repo/list/:name',
        name: 'RepositoryList',
        component: () => import('@/views/repository.list.vue')
      },
      {
        path: '/repository/create',
        name: 'CreateRepository',
        component: () => import('@/views/create.repository.vue')
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/profile.vue')
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
            path: 'account',
            name: 'account',
            component: () => import('@/views/settings/account.vue')
          },
          {
            path: 'security',
            name: 'security',
            component: () => import('@/views/settings/security.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/repo/editable',
    name: 'EditableRepository',
    component: () => import('@/views/editable.repository.vue')
  },
  {
    path: '/knowledge/map',
    name: 'KnowledgeMap',
    component: () => import('@/views/knowledge.map.vue')
  },
  {
    path: '/knowledge/edit',
    name: 'KnowledgeEdit',
    component: () => import('@/views/knowledge.edit.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/views/sign.up.vue')
  },
  {
    path: '/user/edit/:userId',
    name: 'UserEdit',
    component: () => import('@/views/user/user.edit.vue')
  },
  {
    path: '/user/star/:userId',
    name: 'UserStar',
    component: () => import('@/views/user/user.star.vue')
  },
  {
    path: '/test',
    name: 'ComponentTest',
    component: () => import('@/views/component.test.vue')
  },
];

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
});

export default router;

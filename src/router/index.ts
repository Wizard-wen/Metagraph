/**
 *
 */

import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import Main from '../views/main.vue';
import HomePage from '../views/home.page.vue';
import Login from '../views/login.vue';
import SignUp from '../views/sign.up.vue';
import Repository from '../views/repository.vue';
import RepositoryList from '../views/repository.list.vue';
import EditableRepository from '../views/editable.repository.vue';
import CreateRepository from '../views/create.repository.vue';
import UserEdit from '../views/user/user.edit.vue';
import UserStar from '../views/user/user.star.vue';
// test
import IndexTest from '../views/test/index.vue';
import UploadTest from '../views/test/test.upload.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '',
        component: HomePage
      },
      {
        path: 'repo',
        component: Repository
      },
      {
        path: 'repo/list/:name',
        name: 'RepositoryList',
        component: RepositoryList
      },
      {
        path: '/repository/create',
        name: 'CreateRepository',
        component: CreateRepository,
      }
    ]
  },
  {
    path: '/test',
    redirect: '/test/upload',
    name: 'Test',
    component: IndexTest,
    children: [
      {
        path: 'upload',
        component: UploadTest
      }
    ]
  },
  // {
  //   path: '/repo',
  //   name: 'Test',
  //   component: IndexTest,
  //   children: [
  //     {
  //       path: 'upload',
  //       component: UploadTest
  //     }
  //   ]
  // },
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
    component: Login,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/user/edit/:userId',
    name: 'UserEdit',
    component: UserEdit,
  },
  {
    path: '/user/star/:userId',
    name: 'UserStar',
    component: UserStar,
  }
];

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
});

export default router;

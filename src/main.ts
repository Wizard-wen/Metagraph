/**
 * @author wizard.song
 * @date 2021/03/31
 */

import { createApp } from 'vue';
import { clickOutside } from '@/directives/click.outside';
import MetagraphTreeItem from '@/components/metagraph-tree/metagraph-tree-item.vue';
import App from './App.vue';
import router from './router';
import { key, store } from './store';
// 自定义style
import './style/common.scss';
import './style/hide.style.scss';
// 自定义指令
import Contextmenu from './directives/contextmenu';
import Hide from './directives/hide';
import './api-service/config/request.intercepter';
import 'metagraph-ui/dist/style.css';
import './router/router.interceptor';

const app = createApp(App);
app.component('metagraph-tree-item', MetagraphTreeItem);
// 引入全局directive
app.directive('contextmenu', Contextmenu);
app.directive('hide', Hide);
app.directive('clickOutside', clickOutside);
// 引入全局component
// 传入 injection key
app.use(store, key);
app.use(router);
app.mount('#app');

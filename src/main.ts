/**
 * @author wizard.song
 * @date 2021/03/31
 */

import { createApp } from 'vue';
// import {
//   Button, Input, Modal, Select, Form,
//   Spin, Card, Checkbox, Radio,
//   Avatar, Pagination, List, Tag, Drawer,
// } from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
// 自定义style
import './style/common.scss';
import './style/hide.style.scss';
// 自定义指令
import Contextmenu from './directives/contextmenu';
import Hide from './directives/hide';
import { clickOutside } from '@/directives/click.outside';

import './api.service/config/request.intercepter';

const app = createApp(App);
// 引入全局directive
app.directive('contextmenu', Contextmenu);
app.directive('hide', Hide);
app.directive('clickOutside', clickOutside);
// 引入全局component
// app.component('AntTooltip', Tooltip);
// app.component('AntImage', Image);
// app.component('AntSlider', Slider);
// app.component('AntCollapse', Collapse);
// app.component('AntCollapsePanel', Collapse.Panel);
// app.component('AntTimeline', Timeline);
// app.component('AntTimelineItem', Timeline.Item);
// app.component('AntTabs', Tabs);
// app.component('AntTabPane', Tabs.TabPane);
// app.component('AntCol', Col);
// app.component('AntRow', Row);
// app.component('AntDrawer', Drawer);
// app.component('AntEmpty', Empty);
// app.component('AntAlert', Alert);
// app.component('AntDescriptions', Descriptions);
// app.component('AntDescriptionsItem', Descriptions.Item);
// app.component('AntModal', Modal);
// app.component('AntButton', Button);
// app.component('AntForm', Form);
// app.component('AntFormItem', Form.Item);
// app.component('AntSelect', Select);
// app.component('AntSelectOption', Select.Option);
// app.component('AntCheckbox', Checkbox);
// app.component('AntCheckboxGroup', Checkbox.Group);
// app.component('AntRadio', Radio);
// app.component('AntRadioGroup', Radio.Group);
// app.component('AntInput', Input);
// app.component('AntTextArea', Input.TextArea);
// app.component('AntInputSearch', Input.Search);
// app.component('AntInputPassword', Input.Password);
// app.component('AntPageHeader', PageHeader);
// app.component('AntSwitch', Switch);
// app.component('AntSpin', Spin);
// app.component('AntCard', Card);
// app.component('AntMenu', Menu);
// app.component('AntMenuItem', Menu.Item);
// app.component('AntDropdown', Dropdown);
// app.component('AntAvatar', Avatar);
// app.component('AntPagination', Pagination);
// app.component('AntList', List);
// app.component('AntListItem', List.Item);
// app.component('AntListItemMeta', List.Item.Meta);
// app.component('AntTag', Tag);
// app.use(Form);
// 传入 injection key
app.use(store, key);
app.use(router);
app.mount('#app');

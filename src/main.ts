// import { SlatePlugin, vRef } from '@/components/slate-vue-next';
import { ConfigService } from "@/config/config.service";
import { createApp } from 'vue';
import axios, { AxiosResponse } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import {
  Button, Input, Modal, Tree, Select, Form, Icon,
  PageHeader, Switch, Spin, Card, Steps, Comment,
  DatePicker, Checkbox, Radio, Dropdown, Menu,
  Avatar, Pagination, Upload, List, Tag, Drawer,
  Descriptions, Col, Row
} from 'ant-design-vue';
// import VueNativeSock from 'vue-native-websocket-vue3';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import 'ant-design-vue/dist/antd.css';
import '@ant-design/icons-vue';
import './style/common.scss';
// import './style/slate.style.css';
// antd 组件
import Contextmenu from './directives/contextmenu';

// const apiLocalBaseURL = 'http://localhost:7250/';
// const apiTestBaseURL = 'http://edu.songxiwen.com.cn/';
// const apiBaseURL = apiLocalBaseURL;

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.baseURL = ConfigService.apiBaseURL;
  config.headers = {
    ...config.headers,
    'edu-user-token': JSON.parse(localStorage.getItem('user') || '{}')?.token || ''
  };
  // config.baseURL = apiBaseURL;
  return config;
});

axios.interceptors.response.use((response: AxiosResponse) =>
// 对响应数据做点什么
// response 是请求回来的数据
  response,
(error) =>
// 对响应错误做点什么
  Promise.reject(error));

const app = createApp(App);
//

app.directive('contextmenu', Contextmenu);
app.component('AntCol', Col);
app.component('AntRow', Row);
app.component('AntTree', Tree);
app.component('AntDrawer', Drawer);
app.component('AntDescriptions', Descriptions);
app.component('AntDescriptionsItem', Descriptions.Item);
app.component('AntDirectoryTree', Tree.DirectoryTree);
app.component('AntTreeNode', Tree.TreeNode);
app.component('AntModal', Modal);
app.component('AntButton', Button);
app.component('AntForm', Form);
app.component('AntFormItem', Form.Item);
app.component('AntSelect', Select);
app.component('AntSelectOption', Select.Option);
app.component('AntCheckbox', Checkbox);
app.component('AntCheckboxGroup', Checkbox.Group);
app.component('AntRadio', Radio);
app.component('AntRadioGroup', Radio.Group);
app.component('AntInput', Input);
app.component('AntTextArea', Input.TextArea);
app.component('AntInputSearch', Input.Search);
app.component('AntInputPassword', Input.Password);
app.component('AntUpload', Upload);
app.component('AntIcon', Icon);
app.component('AntDatePicker', DatePicker);
app.component('AntPageHeader', PageHeader);
app.component('AntSwitch', Switch);
app.component('AntSpin', Spin);
app.component('AntCard', Card);
app.component('AntSteps', Steps);
app.component('AntStep', Steps.Step);
app.component('AntComment', Comment);
app.component('AntMenu', Menu);
app.component('AntMenuItem', Menu.Item);
app.component('AntDropdown', Dropdown);
app.component('AntAvatar', Avatar);
app.component('AntPagination', Pagination);
app.component('AntList', List);
app.component('AntListItem', List.Item);
app.component('AntListItemMeta', List.Item.Meta);
app.component('AntTag', Tag);

// app.use(SlatePlugin);
app.use(Form);
// app.use(VueNativeSock, 'ws://localhost:8089');
app.use(store, key).use(router).mount('#app');

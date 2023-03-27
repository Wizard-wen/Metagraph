/**
 * @author songxiwen
 * @date  2022/1/28 21:56
 */

import { reactive } from 'vue';
import { UserNoAuthApiService } from '@/api-service';

export const customFormRules = reactive({
  name: [
    {
      required: true,
      trigger: 'blur',
      async validator(rule: any, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
          if (!value) {
            reject('请输入用户名');
          }
          if (value.length < 3 || value.length > 15) {
            reject('用户名应当在3-15个字符');
          }
          UserNoAuthApiService.checkIfUserExists({
            name: value
          })
            .then((result) => {
              if (result.data) {
                if (result.data.status) {
                  resolve();
                }
                reject('用户已存在');
              } else {
                reject('系统错误');
              }
            });
        });
      }
    },
  ],
  phone: [{
    trigger: 'blur',
    validator(rule: any, value: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (!value) {
          resolve();
        }
        const regExp = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/i;
        if (!regExp.test(value)) {
          reject('手机号格式不正确');
        }
        resolve();
      });
    }
  }],
  email: [
    {
      trigger: 'blur',
      required: true,
      validator(rule: any, value: string): Promise<void> {
        console.log(value);
        return new Promise((resolve, reject) => {
          if (!value) {
            reject('请输入邮箱');
          }
          const regExp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/i;
          if (!regExp.test(value)) {
            reject('邮箱格式不正确');
          }
          resolve();
        });
      }
    },
  ],
  avatar: [
    {
      required: true,
      message: '请上传头像',
      trigger: 'change'
    },
  ]
});

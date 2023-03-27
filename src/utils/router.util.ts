/**
 * @author wizard.song
 * @date  2022/5/10 13:18
 * @description 路由参数加密
 */

import router from '@/router';
import { CryptoUtil } from '@/utils/crypto-util';

// 路由参数的加解密
export class RouterUtil {
  static encryptQuery(params: { [key: string]: string | number }): string {
    const { iv, key } = CryptoUtil.generateAesKeys('123', '456');
    return CryptoUtil.encrypt(JSON.stringify(params), { iv, key });
  }

  static decryptQuery(t: string): { [key: string]: never } {
    // 解密路由参数
    const { iv, key } = CryptoUtil.generateAesKeys('123', '456');
    return JSON.parse(CryptoUtil.decrypt(t, { iv, key }));
  }

  static async jumpTo(path: string, params?: { [key: string]: string | number }): Promise<void> {
    // const result = RouterUtil.encryptQuery(params);
    let queryParams = {};
    if (params) {
      queryParams = {
        ...params
      };
    }
    await router.push({
      path,
      query: {
        ...queryParams
      }
    });
  }

  static async replaceTo(path: string, params?: { [key: string]: string | number }): Promise<void> {
    // const result = RouterUtil.encryptQuery(params);
    let queryParams = {};
    if (params) {
      queryParams = {
        ...params
      };
    }
    await router.push({
      path,
      query: {
        ...queryParams
      },
      replace: true
    });
  }

  static jumpToBlankPage(path: string, params: { [key: string]: string | number }): void {
    // const result = RouterUtil.encryptQuery(params);
    const { href } = router.resolve({
      path,
      query: {
        // t: result
        ...params
      }
    });
    window.open(href, '_blank');
  }
}

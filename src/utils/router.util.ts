/**
 * @author wizard.song
 * @date  2022/5/10 13:18
 * @description 路由参数加密
 */

import router from '@/router';
import { CryptoUtil } from '@/utils/crypto-util';

// 路由参数的加解密
export class RouterUtil {
  static openNewPage(path: string, params: { [key: string]: string | number }): void {
    const { iv, key } = CryptoUtil.generateAesKeys('123', '456');
    const result = CryptoUtil.encrypt(JSON.stringify(params), { iv, key });
    const { href } = router.resolve({
      path,
      query: {
        t: result
      }
    });
    window.open(href, '_blank');
  }
}

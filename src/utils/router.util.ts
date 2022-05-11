/**
 * @author songxiwen
 * @date  2022/5/10 13:18
 */

import router from '@/router';
import {
  enc, AES, PBKDF2, lib, algo
} from 'crypto-js';

// 路由参数的加解密
export class RouterUtil {
  generateAesKeys(password: string, salt: string): {
    iv: string, key: string
  } {
    const keySize = 256;
    const ivSize = 256;
    const encrypted = PBKDF2(password, salt, {
      keySize: (keySize + ivSize) / 32,
      iterations: 1000,
      hasher: algo.SHA256,
    });
    const key = lib.WordArray.create(
      encrypted.words.slice(0, keySize / 32)
    )
      .toString(enc.Base64);
    const iv = lib.WordArray.create(
      encrypted.words.slice(keySize / 32)
    )
      .toString(enc.Base64);
    return {
      iv,
      key
    };
  }

  decrypt(cipher: string, aes: {
    iv: string, key: string
  }): string {
    const iv = enc.Base64.parse(aes.iv);
    const key = enc.Base64.parse(aes.key);
    const data = AES.decrypt(cipher, key, { iv });
    return data.toString(enc.Utf8);
  }

  encrypt(cipher: string, aes: {
    iv: string, key: string
  }): string {
    const iv = enc.Base64.parse(aes.iv);
    const key = enc.Base64.parse(aes.key);
    const data = AES.encrypt(cipher, key, { iv });
    return data.toString();
  }

  openNewPage(params: { [key: string]: any }) {
    const { href } = router.resolve({
      path: '/knowledge/preview',
      query: {
        t: ''
      }
    });
    window.open(href, '_blank');
  }
}

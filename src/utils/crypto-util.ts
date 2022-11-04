/**
 * @author wizard.song
 * @date  2022/5/10 13:18
 * @description 加密
 */

import {
  enc, AES, PBKDF2, lib, algo
} from 'crypto-js';

// 路由参数的加解密
export class CryptoUtil {
  static generateAesKeys(password: string, salt: string): {
    iv: string, key: string
  } {
    const keySize = 256;
    const ivSize = 256;
    // Password-Based Key Derivation Function 基于密码的密钥导出函数
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
      // 初始向量
      iv,
      // 密钥
      key
    };
  }

  static decrypt(cipher: string, aes: {
    iv: string, key: string
  }): string {
    const iv = enc.Base64.parse(aes.iv);
    const key = enc.Base64.parse(aes.key);
    const data = AES.decrypt(cipher, key, { iv });
    return data.toString(enc.Utf8);
  }

  static encrypt(cipher: string, aes: {
    iv: string, key: string
  }): string {
    const iv = enc.Base64.parse(aes.iv);
    const key = enc.Base64.parse(aes.key);
    const data = AES.encrypt(cipher, key, { iv });
    return data.toString();
  }
}

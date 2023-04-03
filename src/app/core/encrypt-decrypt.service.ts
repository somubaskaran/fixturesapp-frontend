import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  constructor() { }

    secretKey = environment.ENCRYPT;
    ivKey = environment.IV;

  encryptData(data: string) {
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const iv = CryptoJS.enc.Utf8.parse(this.ivKey);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data.toString()), key,
    {
        keySize: 256 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return {"data":encrypted.toString()};
    
  }
  decryptData(data: { toString: () => string | CryptoJS.lib.CipherParams; }) {
    try {
      const key = CryptoJS.enc.Utf8.parse(this.secretKey);
      const iv = CryptoJS.enc.Utf8.parse(this.ivKey);
      const decrypted = CryptoJS.AES.decrypt(data.toString(), key, {
          keySize: 256 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

    } catch (e) {
      console.log(e);
    }
  }
  decryptDataForResetPassword(data: { toString: () => string | CryptoJS.lib.CipherParams; }) {
    try {
      const key = CryptoJS.enc.Utf8.parse(this.secretKey);
      const iv = CryptoJS.enc.Utf8.parse(this.ivKey);
      const decrypted = CryptoJS.AES.decrypt(data.toString(), key, {
          keySize: 256 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      
      return decrypted.toString(CryptoJS.enc.Utf8);

    } catch (e) {
      console.log(e);
    }
  }
}

import {JSEncrypt} from "jsencrypt";
import Api from "./Api.ts";

const errNoPublicKey: Error = new Error("No public key");

/**
 * RSA 加解密工具
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 * @since 13th July 2024
 */
class RSAEncryptor {
    private _publicKey?: string;
    private _encryptor: JSEncrypt = new JSEncrypt();
    static #instance: RSAEncryptor = new RSAEncryptor();

    private constructor() {
        Api.getPublicKey().then(resp => {
            this._publicKey = resp.publicKey;
            this._encryptor.setPublicKey(this._publicKey);
        });
    }

    public static get instance(): RSAEncryptor {
        return RSAEncryptor.#instance;
    }

    public get publicKey(): (string | undefined) {
        return this._publicKey;
    }

    public encrypt(data: string): string {
        if(!this._publicKey) {
            throw errNoPublicKey;
        }
        return this._encryptor.encrypt(data) || '';
    }
}

export const Encryptor: RSAEncryptor = RSAEncryptor.instance;
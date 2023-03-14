import { hash, compare } from 'bcrypt';
import * as md5 from 'md5';


export class SecurityUtil {

  static MAX_NUMBER: number = 10;

  static encryptText = async (text: string): Promise<string> => {
    return await hash(text, this.MAX_NUMBER);
  };

  static compareText = async (hash: string, text: string): Promise<boolean> => {
    return await compare(text, hash);
  };

  // static validatePassword = async (hash: string, text: string): Promise<boolean> => {
  //   return md5(hash) === text;
  // };
  static encryptTextToMd5 = async (text: string) => {
    return await md5(text);
  }
}

export class TokenPayload {
  id: number
  name: string
  email: string
  constructor(id: number, name: string, email: string) {
    this.id = id
    this.name = name
    this.email = email
  }

  toPlainObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name
    }
  }
}
import { Payload } from '@/user-school-association/DTOS/payload.dto';
import { BadRequestException } from '@nestjs/common';

const jwt = require('jsonwebtoken');

export default class ValidToken {
  privateKey: string;
  iss: string;
  audience: string;
  token: string;

  constructor(privateKey: string, audience: string, token: string) {
    this.privateKey = privateKey;
    this.audience = audience;
    this.token = token;
  }

  async decodeToken(): Promise<Payload> {
    try {
      const jsonToken = JSON.stringify(this.token);
      const parse = JSON.parse(jsonToken);

      const decoded = jwt.verify(parse.token, this.privateKey);

      return decoded as Payload;
    } catch (error) {
      throw new BadRequestException('Invalid invite, claim a new Invite');
    }
  }
}

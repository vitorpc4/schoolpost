import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';
import { Payload } from '@/user-school-association/DTOS/payload.dto';

const jwt = require('jsonwebtoken');

function currentTimeInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export default class TokenProvider {
  idToken: string;
  ttl: number;
  school: string;
  typeUser: TypeUser;
  admin: boolean;
  audience: string;
  privateKey: string;
  payload: Payload;
  token: string;

  constructor(
    school: string,
    typeUser: TypeUser,
    admin: boolean,
    audience: string,
    privateKey: string,
  ) {
    this.ttl = 600;
    this.idToken = '';
    this.school = school;
    this.audience = audience;
    this.privateKey = privateKey;
    this.payload = new Payload(school, typeUser, admin, audience, this.ttl);
  }

  async getIdToken(): Promise<string> {
    if (this.idToken == '' || this.expired()) {
      this.idToken = await this.generateToken();
    }
    return this.idToken;
  }

  private expired(): boolean {
    return currentTimeInSeconds() + 10 >= this.ttl;
  }

  private async generateToken(): Promise<string> {
    let token = jwt.sign(
      {
        sub: this.payload.school,
        aud: this.payload.target_audience,
        school: this.payload.school,
        typeUser: this.payload.typeUser,
        admin: this.payload.admin,
        exp: this.payload.exp,
        jti: this.payload.jti,
      },
      this.privateKey,
    );

    return token;
  }
}

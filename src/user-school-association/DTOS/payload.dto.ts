import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';

function currentTimeInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export class Payload {
  sub: string;
  aud: string;
  school: string;
  typeUser: TypeUser;
  admin: boolean;
  target_audience: string;
  exp: number;
  iat: number;
  jti: string;

  constructor(
    school: string,
    typeUser: TypeUser,
    admin: boolean,
    targetAudience: string,
    ttl: number,
  ) {
    const time = currentTimeInSeconds();
    this.sub = school;
    this.school = school;
    this.typeUser = typeUser;
    this.admin = admin;
    this.aud = targetAudience;
    this.exp = time + ttl;
    this.jti = 'jwt_once';
    this.iat = time;
    this.target_audience = targetAudience;
  }
}

export class DecodedPayloadDTO {
  sub: number;
  userName: string;
  schools: {
    schoolId: string;
    typeUser: string;
    admin: boolean;
  }[];
  iat: number;
  exp: number;
}

import { DecodedPayloadDTO } from '@/Utils/dtos/decodedPayload.dto';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class GlobalTokenService {
  private decodedToken: DecodedPayloadDTO;

  setDecodedToken(decodedToken: DecodedPayloadDTO) {
    this.decodedToken = decodedToken;
  }

  getDecodedToken() {
    return this.decodedToken;
  }
}

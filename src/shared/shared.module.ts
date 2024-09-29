import { Module } from '@nestjs/common';
import { GlobalTokenService } from './globalTokenService';

@Module({
  providers: [GlobalTokenService],
  exports: [GlobalTokenService],
})
export class SharedModule {}

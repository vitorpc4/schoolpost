import { PipeTransform } from '@nestjs/common';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: any) {}

  transform(value: any) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new Error('Validation failed: ' + error);
    }
  }
}

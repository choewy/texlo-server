import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export type HttpOptions = {
  port: number;
  hostname: string;
  cors: CorsOptions;
};

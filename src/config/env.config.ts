import { registerAs } from '@nestjs/config';

export const envConfig = registerAs('config', () => {
  return {
    server: {
      port: parseInt(process.env.PORT || '3000', 10),
      wsPort: parseInt(process.env.WS_PORT || '8080', 10),
    },
    database: {
      uri:
        process.env.DATABASE_COLLECTIONS_URL || 'mongodb://localhost:27017/ws',
    },
  };
});

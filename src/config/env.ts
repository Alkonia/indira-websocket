import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodb: {
    uri: process.env.DATABASE_COLLECTIONS_URL || '',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    wsPort: parseInt(process.env.WS_PORT || '8080', 10),
  },
};

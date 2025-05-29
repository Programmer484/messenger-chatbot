import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  pageAccessToken: string | undefined;
  verifyToken: string | undefined;
}

const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
  verifyToken: process.env.VERIFY_TOKEN,
};

export default config; 
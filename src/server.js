import app from './app.js';
import env from './config/env.js';
import { connectDb } from './config/db.js';
import * as SentryConfig from './config/sentry.js';

SentryConfig.initSentry();

async function start() {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

start();

import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

/**
 * Database file is deleted before each test in each file is starts.
 */
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

/**
 * Typeorm doesn't know that we deleted the file. So, we close the connection so that Typeorm
 * doesn't hold the connection to the deleted database. This will result in Typeorm creating a new
 * connection for the next test. This executes every test in each file, not just every file.
 */
global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
});

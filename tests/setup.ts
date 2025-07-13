import { setupTestEnvironment, clearDatabase } from '@/tests/utils/testDb';

beforeAll(async () => {
  await setupTestEnvironment();
}, 10000); // 10s timeout

afterEach(async () => {
  await clearDatabase();
});
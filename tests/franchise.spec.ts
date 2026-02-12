import {test, expect} from 'playwright-test-coverage'
import { BasicInit, LoginFranchisee } from './helpers';

test('login', async ({ page }) => {
  await BasicInit(page);
});
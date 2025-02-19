import { test } from '@playwright/test';
import { allure } from 'allure-playwright';
import ROUTES from 'core/routes';
import { USER } from 'core/constants';
import {
  assertCreateButton,
  deleteCreatedTrigger,
} from 'pageObjects/triggers/helpers';
import { assertNotification } from 'pageObjects/helpers/common';
import { NotificationStatus } from 'pageObjects/helpers/constants';
import {
  createTriggerWithGoal,
  createTriggerWithoutGoal,
  editTheTrigger,
} from 'pageObjects/triggers/createTrigger';

test.describe.configure({ retries: 2 });
test.describe('Triggers dashboard filters test', () => {
  test.beforeEach(async ({ page }) => {
    allure.epic('Regression');
    allure.parentSuite('Configure');
    allure.suite(`Triggers Dashboard: ${USER}`);
    allure.subSuite('Dashboard');
    await page.goto(ROUTES.TRIGGERS_DASHBOARD);
    await page.waitForLoadState('networkidle');
    await assertCreateButton(page);
  });
  test(
    'Create New Trigger without goal',
    { tag: '@is_triggers_dashboard' },
    async ({ page }) => {
      allure.severity('critical');
      const testCaseLink =
        'https://squash.kameleoon.net/squash/test-case-workspace/test-case/2044/';
      await allure.link(testCaseLink);
      await createTriggerWithoutGoal(page);
      await deleteCreatedTrigger(page);
      await assertNotification(page, NotificationStatus.Success);
    },
  );
  test(
    'Create New Trigger with goal',
    { tag: '@is_triggers_dashboard' },
    async ({ page }) => {
      allure.severity('critical');
      const testCaseLink =
        'https://squash.kameleoon.net/squash/test-case-workspace/test-case/2115/';
      await allure.link(testCaseLink);
      await createTriggerWithGoal(page);
      await deleteCreatedTrigger(page);
      await assertNotification(page, NotificationStatus.Success);
    },
  );
  test('Edit Trigger', { tag: '@is_triggers_dashboard' }, async ({ page }) => {
    allure.severity('critical');
    const testCaseLink =
      'https://squash.kameleoon.net/squash/test-case-workspace/test-case/2046/';
    await allure.link(testCaseLink);
    await createTriggerWithoutGoal(page);
    await editTheTrigger(page);
    await assertNotification(page, NotificationStatus.Success);
    await deleteCreatedTrigger(page);
    await assertNotification(page, NotificationStatus.Success);
  });
});

import { test } from '@playwright/test';
import { allure } from 'allure-playwright';
import ROUTES from 'core/routes';
import { USER } from 'core/constants';
import { verifyFiltersSidebar } from 'pageObjects/triggers/filters';

test.describe('Triggers dashboard filters test', () => {
  let testCaseLink: string;

  test.beforeEach(async ({ page }) => {
    allure.epic('Regression');
    allure.parentSuite('Configure');
    allure.suite(`Triggers Filters: ${USER}`);
    allure.subSuite('Dashboard');
    await page.goto(ROUTES.TRIGGERS_DASHBOARD);
    await page.waitForLoadState('networkidle');
  });
  test(
    'Check filters sidebar',
    { tag: '@is_triggers_filters' },
    async ({ page }) => {
      allure.severity('critical');
      testCaseLink =
        'https://squash.kameleoon.net/squash/test-case-workspace/test-case/2045/content';
      await allure.link(testCaseLink);
      await verifyFiltersSidebar(page);
    },
  );
});

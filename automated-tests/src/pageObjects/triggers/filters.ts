// https://squash.kameleoon.net/squash/test-case-workspace/test-case/2045

import { Page, test } from '@playwright/test';
import { FILTER_SELECTORS, TIMEOUT } from './constants';

export let isApplyActive: boolean | undefined;

export async function verifyFiltersSidebar(page: Page): Promise<void> {
  const applyButtonDisabled = page.locator(FILTER_SELECTORS.APPLY_DISABLED);
  const applyButtonActive = page.locator(FILTER_SELECTORS.APPLY_GREEN);

  await page
    .locator(FILTER_SELECTORS.FILTERS_SIDEBAR)
    .waitFor({ timeout: TIMEOUT });

  // Check if the "Apply" button is disabled initially
  await test.step('Check if the "Apply" button is disabled', async () => {
    const isApplyDisabled = await applyButtonDisabled.isVisible();
    if (!isApplyDisabled) {
      return;
    }
  });

  // Open all sections in sidebar
  for (let i = 1; i <= 5; i++) {
    await page.locator(FILTER_SELECTORS.SECTION).nth(i).click();
  }

  // Iterate through each checkbox and click it if it's not already checked
  await test.step(
    'Select checkmark Linked to, Key Date, Creator, Characteristics, Goal',
    async () => {
      const checkboxes = page.locator(FILTER_SELECTORS.CHECKBOX);
      const count = await checkboxes.count();
      for (let i = 0; i < count; i++) {
        const checkbox = checkboxes.nth(i);
        const isChecked = await checkbox.evaluate(
          (el, checkedClass) => el.classList.contains(checkedClass),
          FILTER_SELECTORS.CHECKED_CHECKBOX, // Check the correct class for a checked checkbox
        );
        if (!isChecked) {
          await checkbox.click();
        }
      }

      // Check if the second "Submit" button is active after selecting checkboxes
      await test.step('Click the "Submit" button', async () => {
        isApplyActive = await applyButtonActive.isVisible();
        if (isApplyActive) {
          await applyButtonActive.click();
        }
      });

      await test.step('Click the "Reset" button', async () => {
        await page
          .locator(FILTER_SELECTORS.FILTERS_SIDEBAR)
          .waitFor({ timeout: TIMEOUT });
        await page
          .locator(FILTER_SELECTORS.RESET_BUTTON)
          .nth(0)
          .waitFor({ timeout: TIMEOUT });
        await page.locator(FILTER_SELECTORS.RESET_BUTTON).click();
      });
    },
  );
}

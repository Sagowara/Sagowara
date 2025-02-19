// https://squash.kameleoon.net/squash/test-case-workspace/test-case/2115/
// https://squash.kameleoon.net/squash/test-case-workspace/test-case/2044/
// https://squash.kameleoon.net/squash/test-case-workspace/test-case/2046/

import { Page, test } from '@playwright/test';
import { getRandomName } from 'pageObjects/helpers/common';
import { NotificationStatus } from 'pageObjects/helpers/constants';
import { assertNotification } from 'pageObjects/helpers/common';
import {
  POPUP_ROLE,
  POPUP_SELECTORS,
  TRIGGERS_PLACEHOLDERS,
} from './constants';

export async function firstNewTriggerPopUp(page: Page) {
  await test.step('Fill trigger name in first popup', async () => {
    const triggerName = getRandomName();
    await page
      .locator(POPUP_SELECTORS.NAME_TRIGGER_FIELD)
      .getByPlaceholder(TRIGGERS_PLACEHOLDERS.NAME_YOUR_TRIGGER)
      .fill(triggerName);
  });

  await test.step('Select site from dropdown', async () => {
    await page
      .locator(POPUP_SELECTORS.SITE_CONTAINER)
      .getByRole(POPUP_ROLE.COMBOBOX)
      .click();
    await page.locator(POPUP_SELECTORS.SITE).nth(1).click();
  });

  await test.step('Add tag to trigger', async () => {
    const triggerTag = getRandomName();

    await page
      .locator(POPUP_SELECTORS.TAGS_CONTAINER)
      .getByRole(POPUP_ROLE.BUTTON)
      .click();
    await page.getByPlaceholder(TRIGGERS_PLACEHOLDERS.WRITE_A_TAG).focus();
    await page
      .getByPlaceholder(TRIGGERS_PLACEHOLDERS.WRITE_A_TAG)
      .fill(triggerTag);
    await page
      .locator(POPUP_SELECTORS.TAGS_CONTAINER)
      .locator(POPUP_SELECTORS.TAGS_SUBMIT)
      .click();
  });

  await test.step('Add description to trigger', async () => {
    const description = getRandomName();
    
    await page
      .locator(POPUP_SELECTORS.DESCRIPTION_CONTAINER)
      .getByRole(POPUP_ROLE.BUTTON)
      .click();
    await page
      .getByPlaceholder(TRIGGERS_PLACEHOLDERS.ENTER_YOUR_DESCRIPTION)
      .focus();
    await page
      .getByPlaceholder(TRIGGERS_PLACEHOLDERS.ENTER_YOUR_DESCRIPTION)
      .fill(description);
  });

  await test.step('Click continue button', async () => {
    await page.locator(POPUP_SELECTORS.CONTINUE_BUTTON).nth(1).click();
  });
}

export async function triggerBuilder(page: Page) {
  const fillTriggerBuilder = getRandomName();

  await test.step('Double click on conditions container', async () => {
    await page.locator(POPUP_SELECTORS.CONDITIONS_CONTAINER).nth(0).dblclick();
  });

  await test.step('Fill definition field', async () => {
    await page
      .locator(POPUP_SELECTORS.DEFINITION_CONTAINER_FIELD)
      .nth(1)
      .fill(fillTriggerBuilder);
  });

  await test.step('Double click on checkbox', async () => {
    await page.locator(POPUP_SELECTORS.CHECKBOX).nth(2).dblclick();
  });

  await test.step('Click bottom button', async () => {
    await page.locator(POPUP_SELECTORS.BOTTOM_BUTTON).nth(1).click();
  });
}

export async function selectGoalforTrigger(page: Page) {
  await test.step('Select goal for trigger', async () => {
    await page.locator(POPUP_SELECTORS.CHECKBOX).nth(3).click();
  });
}

export async function createTriggerButton(page: Page) {
  await test.step('Click create trigger button', async () => {
    await page.locator(POPUP_SELECTORS.BOTTOM_BUTTON).nth(1).click();
  });
}

export async function createTriggerWithoutGoal(page: Page) {
  await test.step('Create Trigger without Goal and delete it', async () => {
    await firstNewTriggerPopUp(page);
    await triggerBuilder(page);
    await createTriggerButton(page);
    await assertNotification(page, NotificationStatus.Success);
  });
}

export async function createTriggerWithGoal(page: Page) {
  await test.step('Create Trigger with Goal and delete it', async () => {
    await firstNewTriggerPopUp(page);
    await triggerBuilder(page);
    await selectGoalforTrigger(page);
    await createTriggerButton(page);
    await assertNotification(page, NotificationStatus.Success);
  });
}

export async function editTheTrigger(page: Page) {
  await test.step('Edit the trigger', async () => {
    await page.locator(POPUP_SELECTORS.EDIT_BUTTON).click();
    await page.locator(POPUP_SELECTORS.BOTTOM_BUTTON).nth(1).click();
    await page.locator(POPUP_SELECTORS.CHECKBOX).nth(3).click();
    await createTriggerButton(page);
  });
}

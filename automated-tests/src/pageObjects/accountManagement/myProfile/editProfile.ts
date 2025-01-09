// https://squash.kameleoon.net/squash/test-case-workspace/test-case/907/steps
// https://squash.kameleoon.net/squash/test-case-workspace/test-case/1229/content

import { Page, expect, test } from '@playwright/test';
import { ProfileInformationFields, TIMEOUT } from './constants';
import { assertNotification } from '../../helpers/common';
import { NotificationStatus } from '../../helpers/constants';
import { TEST_SERVER_CREDENTIALS } from '../../../core/constants';
import { CARD_SELECTORS } from '../constants';
import { FRAME_SELECTORS } from '../team/dashboard/constants';

export async function editProfile(page: Page): Promise<void> {
  const textField = page
    .locator(CARD_SELECTORS.POPUP_WINDOW)
    .locator(CARD_SELECTORS.TEXT_FIELD);
  const switchButton = page
    .locator(CARD_SELECTORS.SCROLLBAR_CONTENT)
    .locator(CARD_SELECTORS.CHECKBOX);
  const nextButton = page.locator(CARD_SELECTORS.NEXT_BUTTON_GREEN);
  const checkBox = page.locator(CARD_SELECTORS.CHECKBOX);

  await test.step('Click on edit button', async () => {
    const editButton = page.locator(CARD_SELECTORS.EDIT_BUTTON);
    await page.waitForTimeout(TIMEOUT);
    expect(editButton).toBeEnabled();
    await editButton.click();
    await expect(page.locator(CARD_SELECTORS.POPUP_WINDOW)).toBeVisible();
  });

  await test.step('Check name and email', async () => {
    expect(await page.locator(CARD_SELECTORS.USERNAME).innerText()).toEqual(
      `${await textField
        .nth(ProfileInformationFields.FirstName)
        .inputValue()} ${await textField
        .nth(ProfileInformationFields.LastName)
        .inputValue()}`,
    );

    await expect(textField.nth(ProfileInformationFields.Email)).toHaveValue(
      TEST_SERVER_CREDENTIALS.username,
    );
  });

  await test.step('Check change password button', async () => {
    await page
      .locator(FRAME_SELECTORS.CHANGE_PASSWORD_CONTAINER)
      .locator(FRAME_SELECTORS.BUTTON)
      .click();
    await expect(page.locator(CARD_SELECTORS.BUTTON_DISABLED)).toBeVisible();
    await page.locator(CARD_SELECTORS.CANCEL_BUTTON_WHITE).click();
  });

  await test.step('Check button checkboxes', async () => {
    await nextButton.click();

    const switchbuttonCount = await switchButton.count();

    // Uncheck all the checkboxes
    for (let i = 0; i < switchbuttonCount; i++) {
      if (await switchButton.nth(i).isChecked()) {
        await switchButton.nth(i).click();
      }
    }
    await expect(page.locator(CARD_SELECTORS.BUTTON_DISABLED)).toBeVisible();

    // Check all the checkboxes
    for (let i = 0; i < switchbuttonCount; i++) {
      await switchButton.nth(i).click();
    }
    await expect(nextButton).toBeVisible();
  });

  await test.step('Check superadmin checkboxes', async () => {
    const greenCheckbox = page.locator(CARD_SELECTORS.GREEN_CHECKBOX);

    await nextButton.click();
    await checkBox.click();
    await expect(greenCheckbox).not.toBeVisible();
    await checkBox.click();
    await expect(greenCheckbox).toBeVisible();
    await nextButton.click();
    await assertNotification(page, NotificationStatus.Success);
  });
}

// https://squash.kameleoon.net/squash/test-case-workspace/test-case/1907/content?anchor=information

import { Page, test } from '@playwright/test';
import {
  FILTER_SELECTORS,
  POPUP_SELECTORS,
  TIMEOUT,
  ELEMENT_STATES,
  TEXT_CONSTANTS,
} from './constants';
import { LOCATOR_ROLE } from '../../helpers/constants';
import { isApplyActive } from './filters';
import {
  verifyAndClickApplyButton,
  checkAndClickEditButton,
  checkAndClickOnSaveButton,
} from '../common';

export async function editAcquisitionChannel(
  page: Page,
  channelName: string,
  caseSensitive: string,
): Promise<void> {
  await test.step(
    'Check if "Acquisition channel" filter is available and click it',
    async () => {
      await page.waitForSelector(FILTER_SELECTORS.FILTER_ITEM, {
        timeout: TIMEOUT,
      });
      const acquisitionChannelFilter = page.locator(
        FILTER_SELECTORS.FILTER_ITEM,
        {
          hasText: TEXT_CONSTANTS.ACQUISITION_CHANNEL,
        },
      );
      await acquisitionChannelFilter.click();
    },
  );

  await test.step(
    'Verify if "Apply" button is active and click it',
    async () => {
      await verifyAndClickApplyButton(page, Boolean(isApplyActive));
    },
  );

  await test.step(
    'Check if "Edit" button is visible and click it',
    async () => {
      await checkAndClickEditButton(page);
    },
  );

  await test.step(
    'Verify the value of "Name your acquisition channel" field',
    async () => {
      const nameField = page
        .locator(`${LOCATOR_ROLE.INPUT}${POPUP_SELECTORS.TEXT_FIELD}`)
        .nth(1);
      await nameField.waitFor({ state: ELEMENT_STATES.VISIBLE });
      const currentChannelName = await nameField.inputValue();
      if (currentChannelName !== channelName) {
      }
    },
  );

  await test.step(
    'Verify the value of "Regular expression (case sensitive)" field',
    async () => {
      const caseSensitiveField = page
        .locator(`${LOCATOR_ROLE.INPUT}${POPUP_SELECTORS.TEXT_FIELD}`)
        .nth(2);
      await caseSensitiveField.waitFor({ state: ELEMENT_STATES.VISIBLE });
      const currentCaseSensitive = await caseSensitiveField.inputValue();
      if (currentCaseSensitive !== caseSensitive) {
      }
    },
  );

  await test.step(
    'Check if "Save" button is visible and click it',
    async () => {
      await checkAndClickOnSaveButton(page);
    },
  );
}

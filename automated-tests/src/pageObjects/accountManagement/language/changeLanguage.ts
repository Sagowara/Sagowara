// https://squash.kameleoon.net/squash/test-case-workspace/test-case-folder/902/

import { Page, test, expect } from '@playwright/test';
import {
  EXPERIMENTS_LANGUAGE,
  SelectLanguage,
  SelectAccountButton,
  SelectTopMenuButton,
  EXPERIMENTS_LIST,
  SelectSidebarMenu,
} from './constants';
import { CARD_SELECTORS, ACCOUNT_MANAGEMENT_LIST } from '../constants';
import { TypeLanguage } from './type';
import { LOCATOR_ROLE } from '../../helpers/constants';

async function changeLanguage({
  page,
  selectLanguage,
  assertLanguage,
}: TypeLanguage): Promise<void> {
  // Change language test
  await test.step('Open language menu', async () => {
    await page
      .locator(EXPERIMENTS_LIST.TOP_MENU_BUTTON)
      .nth(SelectTopMenuButton.Account)
      .click();
  });
  await test.step('Select language', async () => {
    await page
      .locator(ACCOUNT_MANAGEMENT_LIST.BUTTON)
      .nth(SelectAccountButton.Language)
      .click();
    await page.locator(CARD_SELECTORS.LANGUAGE_MENU).click();
    await page
      .locator(CARD_SELECTORS.LANGUAGE_SELECTOR)
      .nth(selectLanguage)
      .click();
    await page
      .getByRole(LOCATOR_ROLE.DIALOG)
      .locator(CARD_SELECTORS.NEXT_BUTTON_GREEN)
      .click();

    await test.step('Assert language', async () => {
      const sidebarTitleElement = page
        .locator(EXPERIMENTS_LIST.SIDEBAR_TITLE)
        .nth(SelectSidebarMenu.Activate);
      await expect(sidebarTitleElement).toContainText(assertLanguage);
    });
  });
}

export async function changeAccountLanguage(page: Page): Promise<void> {
  await changeLanguage({
    page,
    selectLanguage: SelectLanguage.DE,
    assertLanguage: EXPERIMENTS_LANGUAGE.DE,
  });
  await changeLanguage({
    page,
    selectLanguage: SelectLanguage.FR,
    assertLanguage: EXPERIMENTS_LANGUAGE.FR,
  });
  await changeLanguage({
    page,
    selectLanguage: SelectLanguage.EN,
    assertLanguage: EXPERIMENTS_LANGUAGE.EN,
  });
}


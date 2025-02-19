import { expect, Page, test } from 'playwright/test';
import {
  DASHBOARD_SELECTORS,
  POPUP_SELECTORS,
  ThreeDotsMenu,
  TABLE_CONSTANTS,
  THREE_DOTS,
  ELEMENT_STATES,
  TEXT_CONSTANTS,
  TIMEOUT,
} from './constants';

// Verify if the create button is clickable and exists
export async function assertCreateButton(page: Page) {
  const headerButton = page
    .locator(DASHBOARD_SELECTORS.HEADER_BUTTON_CONTAINER)
    .locator(DASHBOARD_SELECTORS.HEADER_BUTTON);

  await expect(headerButton).toBeEnabled();
  await headerButton.click();
}

export async function deleteCreatedTrigger(page: Page): Promise<void> {
  const actionsMenuButton = page.locator(TABLE_CONSTANTS.THREE_DOTS).first();
  await actionsMenuButton.click();

  const deleteMenuItem = page.locator(THREE_DOTS.SELECTORS, {
    hasText: ThreeDotsMenu.Delete,
  });
  await deleteMenuItem.waitFor({
    state: ELEMENT_STATES.VISIBLE,
    timeout: TIMEOUT,
  });
  await deleteMenuItem.hover();
  await deleteMenuItem.click();

  const deleteButton = page.locator(POPUP_SELECTORS.DELETE_BUTTON, {
    hasText: TEXT_CONSTANTS.DELETE,
  });
  await deleteButton.waitFor({
    state: ELEMENT_STATES.VISIBLE,
    timeout: TIMEOUT,
  });
  await deleteButton.click();
}

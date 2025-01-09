// https://squash.kameleoon.net/squash/test-case-workspace/test-case/39/content

import { expect, test } from '@playwright/test';
import ROUTES from '../../../core/routes';
import {
  ActiveExperimentAction,
  CARD_SELECTORS,
  EXPECT_TIMEOUT,
  IFRAME_SELECTORS,
  SIDEBAR_SELECTORS,
} from '../constants';
import { TypeEditExperiment } from '../types';
import {
  createExperimentWithApiInSpecificStatus,
  deleteExperimentWithApi,
} from '../apiRequests';
import { Status } from '../../helpers/api/constants';
import {
  assertCardStatusNew,
  clickSecondaryActionNew,
  openSecondaryActionsMenuNew,
} from '../../helpers/common';

export async function editExperiment({
  page,
  experimentName: experimentName,
  updatedExperimentName: updatedExperimentName,
  goalId: goalId,
  segmentId: segmentId,
  request,
}: TypeEditExperiment): Promise<void> {
  const experimentId = await createExperimentWithApiInSpecificStatus({
    experimentName: experimentName,
    request: request,
    goalId: goalId,
    segmentId: segmentId,
    status: Status.Active,
  });

  // Navigating to the code editor
  await test.step('Navigating to the code editor', async () => {
    await page.goto(`${ROUTES.EXPERIMENTS_CODE_EDITOR}/${experimentId}`);
  });

  // IFRAME PAGE (WILL BE CHANGED)
  await test.step('Wait IFRAME page', async () => {
    await page.waitForSelector(IFRAME_SELECTORS.WRAPPER);
  });
  const frame = page.frameLocator(IFRAME_SELECTORS.WRAPPER);
  const finalize = frame.locator(IFRAME_SELECTORS.FINALIZE);

  await test.step('Renaming the experiment in the code editor', async () => {
    await expect(
      frame.locator(IFRAME_SELECTORS.EDIT_SUBTITLE_STATUS),
    ).toBeVisible({
      timeout: EXPECT_TIMEOUT,
    });
    await frame.locator(IFRAME_SELECTORS.EDIT_TITLE).dblclick();
    await frame
      .locator(IFRAME_SELECTORS.HEADER)
      .locator(IFRAME_SELECTORS.EDIT_TITLE_INPUT)
      .fill(updatedExperimentName);
  });
  await test.step('Add an additional goal to the experiment', async () => {
    await expect(finalize).toBeVisible();
    await finalize.click();
    const updateButton = frame
      .locator(IFRAME_SELECTORS.CODE_EDITOR_FOOTER_BUTTONS)
      .locator(IFRAME_SELECTORS.CODE_EDITOR_FOOTER_BUTTON)
      .nth(1);

    await expect(updateButton).toBeDisabled();
    await frame.locator(IFRAME_SELECTORS.CODE_EDITOR_ACTION_KPI).nth(1).click();
    await frame.locator(IFRAME_SELECTORS.CODE_EDITOR_GOAL_ITEM).nth(1).click();
    await frame
      .locator(IFRAME_SELECTORS.CODE_EDITOR_GOALS_VALIDATE_EDIT)
      .click();
    await expect(updateButton).toBeEnabled();
    await updateButton.click();
    const buttonClose = frame.locator(
      IFRAME_SELECTORS.CODE_EDITOR_BUTTON_CLOSE,
    );

    await expect(buttonClose).toBeVisible();
    await buttonClose.click();
  });

  // Go back to dashboard and assert the experiment name and status
  await test.step(
    'Go back to dashboard and assert the experiment status',
    async () => {
      await page.goto(ROUTES.EXPERIMENTS_DASHBOARD);
      await assertCardStatusNew({
        page,
        name: updatedExperimentName,
        statusSelector: CARD_SELECTORS.CELL_STATUS_ACTIVE,
      });
    },
  );
  // Assert card status and name, then open actions and click on rename action
  await assertCardStatusNew({
    page,
    name: updatedExperimentName,
    statusSelector: CARD_SELECTORS.CELL_STATUS_ACTIVE,
  });
  await openSecondaryActionsMenuNew(page, updatedExperimentName);
  await test.step('Click "Rename" on action menu', async () => {
    await clickSecondaryActionNew(page, ActiveExperimentAction.Rename);
    await page.waitForSelector(SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_WRAPPER);
  });

  // rename sidebar and save
  await test.step('See rename sidebar and save', async () => {
    const title = page.locator(SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_TITLE);
    const sidebarContent = page.locator(
      SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_WRAPPER,
    );
    const saveButton = sidebarContent
      .locator(SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_FOOTER)
      .locator(SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_SAVE_BUTTON);

    await page.waitForSelector(SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_TITLE);
    await expect(title).toBeVisible();
    await page
      .locator(SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_WRAPPER)
      .locator(SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_NAME_INPUT)
      .fill(experimentName);
    expect(
      await page
        .locator(SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_WRAPPER)

        .locator(SIDEBAR_SELECTORS.OVERLAY_SIDEBAR_NAME_INPUT)
        .inputValue(),
    ).toEqual(experimentName);
    await expect(saveButton).not.toBeDisabled();
    await saveButton.click();
  });

  // Verify that the experiment was renamed
  await assertCardStatusNew({
    page,
    name: experimentName,
    statusSelector: CARD_SELECTORS.CELL_STATUS_ACTIVE,
  });
  await deleteExperimentWithApi(
    experimentId,
    request,
    CARD_SELECTORS.CELL_STATUS_ACTIVE,
  );
}


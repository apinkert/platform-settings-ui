import { test, expect } from '@playwright/test';
import { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';

test.describe('platform settings ui', async () => {
    test.beforeEach(async ({page}): Promise<void> => {
        await disableCookiePrompt(page);
        await page.goto('/', { waitUntil: 'load', timeout: 60000 });
    });

    test('platform settings page loads and has the expected content', async({page}) => {
        await page.getByLabel('Expandable search input toggle').click();
        await page.getByLabel('Search input').first().pressSequentially('platform');
        await page.getByText('Platform Settings').first().click();

        await expect(page.getByText('Platform Settings')).toBeVisible();
    });

});

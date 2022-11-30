// github-setup.js
const { chromium } = require('@playwright/test');

module.exports = async config => {
  const browser = await chromium.launch({
    headless: false,
    //devtools: true
  });
  const page = await browser.newPage();
  await page.goto('https://github.com/login');
  await page.getByLabel('Username').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', {name: 'Sign in'}).click();

  // Save signed-in state to '...storageState.json'.
  await page.context().storageState({ path: './storage/github-username-storageState.json' });
  await browser.close();
};
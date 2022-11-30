// npx playwright test Git --headed --project=chromium --debug
// @ts-check
const { test, expect } = require('@playwright/test');


//Redoing login for every test can be slow
/*
test.beforeEach(async ({ page }) => {
  // Docs -- https://playwright.dev/docs/auth
  // Runs before each test and signs in each page.
  await page.goto('https://github.com/login');
  await page.getByLabel('Username').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', {name: 'Sign in'}).click();
  await expect(page).not.toHaveURL('https://github.com/session');
  //await expect(page.getByText('Incorrect username or password.')).not.toHaveURL('https://github.com/session');
  // Incorrect username or password
  // await page.getByText('Incorrect username or password.')
});
*/


test.describe.parallel('Unauthenticated tests', () => {
  
  test('Webdriverjsdemo: can view as guest', async ({ page }) => {
    await page.goto('http://webdriverjsdemo.github.io/auth/')
    await expect(page.locator('text=Hello Please Sign In')).toBeVisible()
  });

  test('GitHub: Visit anatolyg', async ({ page }) => {
    // https://github.com/anatolyg
    await page.goto('https://github.com/anatolyg');
    //await expect(page.locator('span:has-text("Anatoly Geyfman")').nth(2)).toBeVisible();
    //await page.getByText('Anatoly Geyfman');
    await expect(
      page.getByRole('heading', { level: 1, class: 'vcard-names' })
    ).toBeVisible()

    await expect(
      //page.locator("//h1")                        // resolves to 2 (error)
      //page.locator("//h1[@class='vcard-names']")  // does not find
      //               div[@class='error-msg']      // How to use clasS?
      page.locator("//h1").nth(0)
    ).toBeVisible()

    const nickname = await (
      await page.locator(
        //"//h1/span[contains(@class='p-nickname')]" // No
        //"//h1/span[2]" // yes
        "//h1/span[@itemprop='additionalName']" // yes
        ).textContent()
    ).trim();

    const name = await (await page.locator("//h1/span[@itemprop='name']").textContent()).trim();
    console.log("Page by User: "+name);
    console.log("Page user nickname: "+nickname);

    expect(nickname).toBe('anatolyg');

  });


})


test.describe.parallel('Authenticated tests', () => {
    
  test.use({storageState: './storage/github-joebiker-storageState.json'})
  
  test('Is Logged in', async ({ page }) => {
    // Am I logged in?
    await page.goto('https://github.com/joebiker');
    await page.getByRole('button', { name: 'View profile and more' }).click();
    await page.getByRole('menuitem', { name: 'Your profile' }).click();
    await expect(page).toHaveURL('https://github.com/joebiker');

    console.log("This will search for CSS selectors...");
    const test = await page.locator('css=UnderlineNav-item');
    console.log(await test.count());

    // TODO: How many repos? 9 public, 11 total
    var repoLink = await page.getByRole('link', {name: "Repositories"});
    var count = await repoLink.locator('Counter')

    var repoText2 = page.locator('[data-tab-item=repositories]')
    var repoText3 = page.locator('css=UnderlineNav-item');
    
    // Not able to find the right selector.
    //await expect.soft(await count).toHaveText('9');
    const repositories = await (
      await page.locator(
        "//a[@data-tab-item='repositories']/span[@class='Counter']"
        ).nth(1).textContent()
    ).trim();

    console.log("Public and Private repositories by Joe: "+repositories);
    expect(repositories).toBe('11'); // Logged in (11 if not logged in) 

  });


  test('Aldebaron/HW2', async ({ page }) => {
    
    // page is signed in.
    await page.goto('https://github.com/Aldebaron/HW2');
    await expect(page).toHaveURL('https://github.com/Aldebaron/HW2');

    //var readme = await page.getByRole('heading', { name: 'HW2' });
    //await expect(readme).toContainText('HW2');

    await expect(page.getByRole('button', { name: ' Add File ' })).toBeVisible();

  });


})

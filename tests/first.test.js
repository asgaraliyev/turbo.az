const { test, expect } = require('@playwright/test');
const { account } = require('../store');
function sleep(t){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve()
    },t)
  })
}
test.describe('insagram', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext({isMobile:true,headless:false});
      page = await context.newPage();
  });
  test.afterAll(async ({})=>{
    await sleep(9999999)
  })
  test("login")  
  test('start', async () => {
    await page.goto('https://www.instagram.com/');
  });

  // test('header test', async () => {
  //     const name = await page.innerText('h1');
  //     expect(name).toContain('Domain');
  // });
});
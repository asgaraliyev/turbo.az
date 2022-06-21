const { chromium, devices, expect } = require("playwright");
// const {account} =require("./store.js")
async function closeModals({ page }) {
  // Click text=Not Now
  await page.click("text=Not Now");
  // Click .qF0y9.Igw0E.IwRSH.eGOV_._4EzTm.zQLcH .wpO6b
  await page.click(".qF0y9.Igw0E.IwRSH.eGOV_._4EzTm.zQLcH .wpO6b");
}
async function findSpecificActivityElement({ page, text }) {}
async function onResponse({ response, page }) {
  const resData = {
    url: response.url(),
    status: response.status(),
  };
  if (resData.url.includes("v1/news/inbox/")) {
    try {
      console.log("resData", resData);
      resData.body = await response.json();
      for (let index = 0; index < resData.body.old_stories.length; index++) {
        const activity = resData.body.old_stories[index].args;
      

        if (activity.comment_notif_type) {
          if (activity.text.includes("what is @?")) {
            let activityTextCopy=activity.text
            activityTextCopy=            activityTextCopy.replace(activity.profile_name,"")
            console.log("activityTextCopy",activityTextCopy)
            await page.click(`text=${activityTextCopy}`);
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}
async function login({ page, username, password }) {
  // Go to https://www.instagram.com/
  await page.goto("https://www.instagram.com/");
  // Click text=Log In
  await page.click("text=Log In");
  // Click [aria-label="Phone number, username, or email"]
  await page.click('[aria-label="Phone number, username, or email"]');
  // Fill [aria-label="Phone number, username, or email"]
  await page.fill('[aria-label="Phone number, username, or email"]', username);
  // Press Tab
  await page.press('[aria-label="Phone number, username, or email"]', "Tab");
  // Fill [aria-label="Password"]
  await page.fill('[aria-label="Password"]', password);
  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://www.instagram.com/accounts/onetap/?next=%2F' }*/),
    page.press('[aria-label="Password"]', "Enter"),
  ]);
}
async function goActivitiesPage({ page }) {
  await page.click('[aria-label="Activity"]');
  await expect(page).toHaveURL("https://www.instagram.com/accounts/activity/");
}

(async (_) => {
  const { account } = require("./store");
  const browser = await chromium.launch({
    headless: false,
  });

  const pixel2 = devices["iPhone 13 Pro"];
  const context = await browser.newContext({
    ...pixel2,
  });
  const page = await context.newPage();
  await page.on("response", async (response) => {
    await onResponse({ response, page });
  });
  await login({ page, username: account.username, password: account.password });
  await closeModals({ page });
  await goActivitiesPage({ page });
})();

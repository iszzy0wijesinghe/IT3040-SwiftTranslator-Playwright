import { test, expect } from "@playwright/test";

test("OUTPUT_LOCATOR_CHECK", async ({ page }) => {
  await page.goto("https://www.swifttranslator.com/", { waitUntil: "domcontentloaded" });

  const inputBox = page.getByRole("textbox", { name: "Input Your Singlish Text Here." });
  await inputBox.fill("mama gedhara yanavaa");
  await page.waitForTimeout(1500);

  // Go up to a higher container (2 levels) then search inside it
  const container = inputBox.locator("xpath=ancestor::div[2]");

  // Find visible Sinhala output inside that container ONLY
  const outputEl = container
    .locator(':text-matches(".*[\\u0D80-\\u0DFF].*", "s")')
    .filter({ hasNot: page.getByText("English") }) // extra safety
    .first();

  await expect(outputEl).toBeVisible();

  const actual = (await outputEl.innerText()).trim();
  console.log("Sinhala output:", actual);

  expect(actual.length).toBeGreaterThan(0);
});




// import { test, expect } from "@playwright/test";

// test("OUTPUT_LOCATOR_CHECK", async ({ page }) => {
//   await page.goto("https://www.swifttranslator.com/", {
//     waitUntil: "domcontentloaded",
//   });

//   const inputBox = page.getByRole("textbox", {
//     name: "Input Your Singlish Text Here.",
//   });

//   await inputBox.fill("mama gedhara yanavaa");
//   await page.waitForTimeout(1500);

//   // Find Sinhala output anywhere on page (contains Sinhala letters ?-?)
//   const outputEl = page.locator(':text-matches(".*[අ-ෆ].*", "s")').last();

//   await expect(outputEl).toBeVisible();

//   const actual = (await outputEl.innerText()).trim();
//   console.log("Sinhala output:", actual);

//   expect(actual.length).toBeGreaterThan(0);
// });



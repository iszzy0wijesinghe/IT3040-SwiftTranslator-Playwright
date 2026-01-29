import { test, expect } from "@playwright/test";
import fs from "fs";
import cases from "../test-data/cases.json";


test.setTimeout(120000); // 2 minutes


const INPUT = (page: any) =>
  page.getByRole("textbox", { name: "Input Your Singlish Text Here." });

const OUTPUT_TEXT = (page: any) => {
  const inputBox = INPUT(page);
  const container = inputBox.locator("xpath=ancestor::div[2]");
  return container
    .locator(':text-matches(".*[\\u0D80-\\u0DFF].*", "s")')
    .filter({ hasNot: page.getByText("English") })
    .first();
};

const normalize = (s: string) =>
  (s ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, "\n")
    .trim();

test("CAPTURE_EXPECTED_POS_FUN", async ({ page }) => {
  await page.goto("https://www.swifttranslator.com/", { waitUntil: "domcontentloaded" });

  const inputBox = INPUT(page);

  for (const tc of cases as any[]) {
    if (tc.type !== "positive") continue;

    await inputBox.fill("");
    await inputBox.fill(tc.input);
    await page.waitForTimeout(1500);

    const outputEl = OUTPUT_TEXT(page);
    await expect(outputEl).toBeVisible();

    const actual = normalize(await outputEl.innerText());

    // overwrite expected with tool output
    tc.expected = actual;

    // optional: store last actual too
    tc.actual = actual;
    tc.status = "Pass";
  }

  fs.writeFileSync("test-data/cases.updated.json", JSON.stringify(cases, null, 2), "utf-8");
});

// Capture the real Design 2 entrance, comfort choices, and section transitions.
// Run against a local server: node scripts/capture-motion.mjs
import { chromium } from "@playwright/test";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const output = path.join(process.cwd(), "screenshots/design-2-motion.webm");
const temporary = await mkdtemp(path.join(tmpdir(), "mcgarrett-motion-"));
await mkdir(path.dirname(output), { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
    recordVideo: { dir: temporary, size: { width: 1440, height: 1000 } },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseURL}/design-2`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  // These pauses are the intentional viewing time in the recorded demonstration.
  await page.waitForTimeout(1500);
  await page.mouse.move(1120, 430, { steps: 12 });
  await page.waitForTimeout(350);
  await page
    .getByRole("button", { name: "Warm things up", exact: true })
    .click();
  await page.waitForTimeout(850);
  await page.getByRole("button", { name: "Keep it cool", exact: true }).click();
  await page.waitForTimeout(650);
  await page
    .locator("#help")
    .evaluate((element) =>
      element.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  await page.waitForTimeout(1100);
  await page
    .getByRole("button", { name: "I need heating service.", exact: true })
    .click();
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(1200);
  const video = page.video();
  await context.close();
  if (errors.length)
    throw new Error(`Motion preview had browser errors: ${errors.join("; ")}`);
  await video.saveAs(output);
  console.log(output);
} finally {
  await browser.close();
  await rm(temporary, { recursive: true, force: true });
}

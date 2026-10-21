// Run after the final visual refinement: node tests/capture.mjs
// The server must already be running, or set PLAYWRIGHT_BASE_URL.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const root = process.cwd();
await mkdir(path.join(root, "screenshots"), { recursive: true });
await mkdir(path.join(root, "public/previews"), { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
});

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    await Promise.all(
      Array.from(document.images)
        .filter((image) => image.getBoundingClientRect().width > 0)
        .map((image) =>
          Promise.race([
            image.decode().catch(() => {}),
            new Promise((resolve) => setTimeout(resolve, 4000)),
          ]),
        ),
    );
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
  const brokenImages = await page
    .locator("img")
    .evaluateAll((images) =>
      images
        .filter(
          (image) =>
            image.getBoundingClientRect().width > 0 &&
            (!image.complete || image.naturalWidth === 0),
        )
        .map((image) => ({ src: image.currentSrc, alt: image.alt })),
    );
  if (brokenImages.length) {
    throw new Error(
      `Capture stopped: photographs or previews failed to load: ${JSON.stringify(brokenImages)}`,
    );
  }
}

async function openForCapture(page, route) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const response = await page.goto(`${baseURL}${route}`, {
    waitUntil: "networkidle",
  });
  if (!response?.ok())
    throw new Error(`Capture stopped: ${route} returned ${response?.status()}`);
  await settle(page);
  if (errors.length)
    throw new Error(
      `Capture stopped: ${route} produced browser errors: ${errors.join("; ")}`,
    );
}

try {
  // Capture real homepage previews before loading the selection page that uses them.
  // They are retina (2x) and three screens tall so the selection page can scroll them.
  for (const number of [1, 2]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1240 },
      reducedMotion: "reduce",
      deviceScaleFactor: 2,
    });
    await openForCapture(page, `/design-${number}`);
    await page.screenshot({
      path: path.join(root, `public/previews/design-${number}-desktop.jpg`),
      type: "jpeg",
      quality: 90,
      fullPage: true,
      clip: { x: 0, y: 0, width: 1440, height: 3720 },
    });
    await page.close();
    console.log(
      `Actual homepage preview: public/previews/design-${number}-desktop.jpg`,
    );
  }
  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 375, height: 812 },
  ]) {
    for (const route of [
      { path: "/", name: "selection" },
      { path: "/design-1", name: "design-1" },
      { path: "/design-2", name: "design-2" },
    ]) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
      });
      await openForCapture(page, route.path);
      const filename = `screenshots/${route.name}-${viewport.name}.png`;
      await page.screenshot({
        path: path.join(root, filename),
        fullPage: true,
      });
      console.log(filename);
      if (route.name === "design-2") {
        await page
          .getByRole("button", { name: "Warm things up", exact: true })
          .click();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(100);
        const heatingFilename = `screenshots/design-2-${viewport.name}-heating.png`;
        await page.screenshot({ path: path.join(root, heatingFilename) });
        console.log(heatingFilename);
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
}

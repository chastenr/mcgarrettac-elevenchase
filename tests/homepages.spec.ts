import { expect, test, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const concepts = [
  { path: "/design-1", title: /Precision Comfort/i, design: "Design 1" },
  { path: "/design-2", title: /Comfort, Close to Home/i, design: "Design 2" },
] as const;
const routes = [{ path: "/", title: /McGarrett/i }, ...concepts];

async function ready(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.ok(), `Direct load of ${path}`).toBeTruthy();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

async function expectReadableHeroHeading(hero: Locator) {
  const heading = hero.getByRole("heading", { level: 1 });
  await expect(heading).toBeVisible();
  const obscuredText = await heading.evaluate((element) =>
    [element, ...element.querySelectorAll("span, em")]
      .filter((fragment) => {
        let ancestor: Element | null = fragment;
        while (ancestor && ancestor !== document.body) {
          const style = getComputedStyle(ancestor);
          if (Number(style.opacity) < 0.99 || style.visibility === "hidden") return true;
          ancestor = ancestor.parentElement;
        }
        return false;
      })
      .map((fragment) => fragment.textContent),
  );
  expect(obscuredText, "Every headline fragment and its ancestors remain readable").toEqual([]);
}

async function visitWholePage(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 750) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
  });
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete || !image.getClientRects().length) return;
        return new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
          setTimeout(resolve, 4_000);
        });
      }),
    );
  });
}

for (const route of routes) {
  test(`${route.path}: direct route, metadata, and readable content`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await ready(page, route.path);
    await page.waitForLoadState("networkidle");
    expect(
      errors,
      "Page should render without runtime or hydration errors",
    ).toEqual([]);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /nofollow/,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S.{35,}/,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test(`${route.path}: responsive layout stays inside the viewport`, async ({
    page,
  }) => {
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await ready(page, route.path);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(
        dimensions.document,
        `${route.path} document overflow at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.viewport + 1);
      expect(
        dimensions.body,
        `${route.path} body overflow at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.viewport + 1);
      const headline = await page.locator("h1").boundingBox();
      expect(headline).not.toBeNull();
      expect(
        headline!.x,
        `${route.path} headline starts within viewport at ${width}px`,
      ).toBeGreaterThanOrEqual(-1);
      expect(
        headline!.x + headline!.width,
        `${route.path} headline ends within viewport at ${width}px`,
      ).toBeLessThanOrEqual(width + 1);
    }
  });

  test(`${route.path}: displayed photographs and previews load`, async ({
    page,
  }) => {
    await ready(page, route.path);
    await visitWholePage(page);
    const broken = await page.locator("img").evaluateAll((images) =>
      images
        .filter((image) => {
          const img = image as HTMLImageElement;
          const rect = img.getBoundingClientRect();
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            (!img.complete || img.naturalWidth === 0)
          );
        })
        .map((image) => ({
          src: (image as HTMLImageElement).currentSrc,
          alt: image.getAttribute("alt"),
        })),
    );
    expect(broken).toEqual([]);
    expect(await page.locator("img").count()).toBeGreaterThan(0);
  });

  test(`${route.path}: no serious or critical automated accessibility violations`, async ({
    page,
  }) => {
    await ready(page, route.path);
    await visitWholePage(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const significant = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    );
    expect(
      significant.map((violation) => ({
        id: violation.id,
        description: violation.description,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  });
}

test("Selection previews open both complete concepts and browser Back returns to selection", async ({
  page,
}) => {
  await ready(page, "/");
  await expect(
    page.getByRole("heading", { name: "Two ways to experience McGarrett." }),
  ).toBeVisible();
  for (const concept of concepts) {
    const explore = page.getByRole("link", {
      name: `Explore ${concept.design}`,
      exact: true,
    });
    await expect(explore).toHaveAttribute("href", concept.path);
    await explore.click();
    await expect(page).toHaveURL(new RegExp(`${concept.path}$`));
    await expect(page).toHaveTitle(concept.title);
    await expect(page.getByRole("contentinfo")).toBeAttached();
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { name: "Two ways to experience McGarrett." }),
    ).toBeVisible();
  }
});

test("Presentation controls switch concepts and return to all designs", async ({
  page,
}) => {
  await ready(page, "/design-1");
  let controls = page.getByRole("navigation", {
    name: "Homepage design presentation",
  });
  await controls.getByRole("link", { name: /^Design 2/ }).click();
  await expect(page).toHaveURL(/\/design-2$/);
  controls = page.getByRole("navigation", {
    name: "Homepage design presentation",
  });
  await expect(
    controls.getByRole("link", { name: /^Design 2/ }),
  ).toHaveAttribute("aria-current", "page");
  await controls.getByRole("link", { name: /^Design 1/ }).click();
  await expect(page).toHaveURL(/\/design-1$/);
  await controls.getByRole("link", { name: /All designs/ }).click();
  await expect(page).toHaveURL(/\/$/);
});

for (const concept of concepts) {
  test(`${concept.design}: service choices preserve entered contact information`, async ({
    page,
  }) => {
    await ready(page, concept.path);
    await page
      .getByRole("textbox", { name: /^Your name/ })
      .fill("Taylor Preview");
    await page
      .getByRole("textbox", { name: /^Phone number/ })
      .fill("+1 (346) 555-0199");
    await page
      .getByRole("textbox", { name: /^How can we help/ })
      .fill("Please discuss routine service for my property.");
    const footer = page.getByRole("contentinfo");
    await footer
      .getByRole("link", { name: "Annual maintenance", exact: true })
      .click();
    await expect(
      page.getByRole("combobox", { name: /^Service needed/ }),
    ).toHaveValue("maintenance");
    await expect(page.getByRole("textbox", { name: /^Your name/ })).toHaveValue(
      "Taylor Preview",
    );
    await footer.getByRole("link", { name: "Heating", exact: true }).click();
    await expect(
      page.getByRole("combobox", { name: /^Service needed/ }),
    ).toHaveValue("heating");
    await expect(
      page.getByRole("textbox", { name: /^Phone number/ }),
    ).toHaveValue("+1 (346) 555-0199");
    await expect(
      page.getByRole("textbox", { name: /^How can we help/ }),
    ).toHaveValue("Please discuss routine service for my property.");
    await page
      .getByRole("combobox", { name: /^Service needed/ })
      .selectOption({ label: "Indoor air quality" });
    await expect(
      page.getByRole("combobox", { name: /^Service needed/ }),
    ).toHaveValue("air-quality");
  });

  test(`${concept.design}: validation and preview confirmation are honest, accessible, and local`, async ({
    page,
  }) => {
    await ready(page, concept.path);
    const submit = page.getByRole("button", {
      name: "Preview service request",
    });
    await expect(
      page.getByText("This is a design preview. Requests are not sent.", {
        exact: true,
      }),
    ).toBeVisible();
    await submit.click();
    const errors = page
      .getByRole("alert")
      .filter({ hasText: "Please check your request." });
    await expect(errors).toBeFocused();
    await expect(errors).toContainText("Enter your name.");
    await expect(errors).toContainText("Enter a 10-digit US phone number");
    await expect(errors).toContainText("Choose the service you need.");
    await expect(
      page.getByRole("textbox", { name: /^Your name/ }),
    ).toHaveAttribute("aria-invalid", "true");
    await page
      .getByRole("textbox", { name: /^Your name/ })
      .fill("Taylor Preview");
    await page
      .getByRole("textbox", { name: /^Phone number/ })
      .fill("+1 (346) 555-0199");
    await page
      .getByRole("combobox", { name: /^Service needed/ })
      .selectOption({ label: "Air conditioning" });
    await page
      .getByRole("combobox", { name: /^Property type/ })
      .selectOption("Multifamily");
    const location = page.getByRole("textbox", { name: /^City or ZIP code/ });
    await expect(location).not.toHaveAttribute("type", "number");
    await location.fill("0123");
    await page.getByRole("textbox", { name: /^Email/ }).fill("bad-address");
    await submit.click();
    await expect(errors).toContainText(
      "Enter a valid email address or leave it blank.",
    );
    await expect(errors).toContainText(
      "Enter a 5-digit or 9-digit ZIP code, or a city name.",
    );
    await page.getByRole("textbox", { name: /^Email/ }).fill("");
    await location.fill("01234");
    const deliveries: string[] = [];
    page.on("request", (request) => {
      if (
        ["fetch", "xhr"].includes(request.resourceType()) &&
        !["GET", "HEAD"].includes(request.method())
      )
        deliveries.push(`${request.method()} ${request.url()}`);
    });
    await submit.click();
    const confirmation = page
      .getByRole("status")
      .filter({ hasText: "Preview only — your request has not been sent." });
    await expect(confirmation).toHaveText(
      "Preview only — your request has not been sent. Call 346-946-7577 to contact McGarrett.",
    );
    await expect(confirmation).toBeFocused();
    await expect(location).toHaveValue("01234");
    expect(deliveries, "Demo form must not send a service request").toEqual([]);
    const stored = await page.evaluate(() =>
      JSON.stringify(Object.entries(localStorage)),
    );
    expect(stored).not.toContain("Taylor Preview");
    expect(stored).not.toContain("555-0199");
  });

  test(`${concept.design}: mobile navigation works with keyboard and Escape`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await ready(page, concept.path);
    const open = page.getByRole("button", {
      name: "Open navigation",
      exact: true,
    });
    await open.click();
    const menu = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(menu).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Close navigation" }),
    ).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(open).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(menu).toBeVisible();
    const services = menu.locator('a[href="#services"]');
    await services.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#services$/);
    await expect(menu).toHaveCount(0);
    await expect(open).toHaveAttribute("aria-expanded", "false");
  });

  test(`${concept.design}: useful contact links, anchors, and FAQ disclosure`, async ({
    page,
  }) => {
    await ready(page, concept.path);
    const footer = page.getByRole("contentinfo");
    await expect(
      footer.getByRole("link", { name: "346-946-7577" }),
    ).toHaveAttribute("href", "tel:+13469467577");
    await expect(
      footer.getByRole("link", { name: "mcgarrettac@gmail.com" }),
    ).toHaveAttribute("href", "mailto:mcgarrettac@gmail.com");
    const missingAnchors = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href")!)
          .filter(
            (href) =>
              href.length < 2 ||
              !document.getElementById(decodeURIComponent(href.slice(1))),
          ),
      );
    expect(missingAnchors).toEqual([]);
    const question = page.locator("#faq summary").first();
    await question.focus();
    await page.keyboard.press("Enter");
    await expect(question.locator("..")).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(question.locator("..")).not.toHaveAttribute("open", "");
  });
}

test("Design 1: hero intent and keyboard service explorer carry service choices", async ({
  page,
}) => {
  await ready(page, "/design-1");
  await page.getByLabel("I need help with").selectOption({ label: "Heating" });
  await page.getByLabel("At my", { exact: true }).selectOption("Commercial");
  await page.getByRole("link", { name: "Get started", exact: true }).click();
  await expect(
    page.getByRole("combobox", { name: /^Service needed/ }),
  ).toHaveValue("heating");
  await expect(
    page.getByRole("combobox", { name: /^Property type/ }),
  ).toHaveValue("Commercial");
  const firstService = page.getByRole("tab", { name: /Air conditioning/ });
  await firstService.focus();
  await page.keyboard.press("ArrowDown");
  const heating = page.getByRole("tab", { name: /Heating/ });
  await expect(heating).toBeFocused();
  await expect(heating).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("tabpanel")
    .getByRole("link", { name: "Request this service" })
    .click();
  await expect(
    page.getByRole("combobox", { name: /^Service needed/ }),
  ).toHaveValue("heating");
});

test("Design 2: the needs selector fills the editable request without losing details", async ({
  page,
}) => {
  await ready(page, "/design-2");
  await page
    .getByRole("textbox", { name: /^Your name/ })
    .fill("Jordan Preview");
  const needs = page.getByRole("group", {
    name: "What do you need help with?",
  });
  await needs
    .getByRole("button", {
      name: "I need help with a business property.",
      exact: true,
    })
    .click();
  await expect(
    needs.getByRole("button", {
      name: "I need help with a business property.",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("heading", { name: "Comfort matters at work, too." }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: /^Service needed/ }),
  ).toHaveValue("commercial");
  await expect(
    page.getByRole("combobox", { name: /^Property type/ }),
  ).toHaveValue("Commercial");
  await page
    .getByRole("group", { name: "What kind of property?" })
    .getByRole("button", { name: "Multifamily", exact: true })
    .click();
  await needs
    .getByRole("button", { name: "I’m planning maintenance.", exact: true })
    .click();
  await page
    .locator("#help")
    .getByRole("link", { name: "Request service", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", { name: /^Service needed/ }),
  ).toHaveValue("maintenance");
  await expect(
    page.getByRole("combobox", { name: /^Property type/ }),
  ).toHaveValue("Multifamily");
  await expect(page.getByRole("textbox", { name: /^Your name/ })).toHaveValue(
    "Jordan Preview",
  );
});

test("Design 2: hero comfort choices work by keyboard and preserve an editable request", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await ready(page, "/design-2");
  const hero = page.locator("main section").first();
  const cooling = hero.getByRole("button", {
    name: "Keep it cool",
    exact: true,
  });
  const heating = hero.getByRole("button", {
    name: "Warm things up",
    exact: true,
  });
  await expect(cooling).toHaveAttribute("aria-pressed", "true");
  await expect(heating).toHaveAttribute("aria-pressed", "false");
  const name = page.getByRole("textbox", { name: /^Your name/ });
  const phone = page.getByRole("textbox", { name: /^Phone number/ });
  const description = page.getByRole("textbox", { name: /^How can we help/ });
  await name.fill("Morgan Preview");
  await phone.fill("+1 (346) 555-0188");
  await description.fill("Please discuss the equipment at our property.");
  await page
    .getByRole("combobox", { name: /^Property type/ })
    .selectOption("Multifamily");
  await heating.focus();
  await page.keyboard.press("Space");
  await expect(heating).toHaveAttribute("aria-pressed", "true");
  await expect(cooling).toHaveAttribute("aria-pressed", "false");
  await hero
    .getByRole("link", { name: "Request service", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", { name: /^Service needed/ }),
  ).toHaveValue("heating");
  await expect(
    page.getByRole("combobox", { name: /^Property type/ }),
  ).toHaveValue("Multifamily");
  await expect(name).toHaveValue("Morgan Preview");
  await expect(phone).toHaveValue("+1 (346) 555-0188");
  await expect(description).toHaveValue(
    "Please discuss the equipment at our property.",
  );
  await cooling.focus();
  await page.keyboard.press("Enter");
  await expect(cooling).toHaveAttribute("aria-pressed", "true");
  await expect(heating).toHaveAttribute("aria-pressed", "false");
  await hero
    .getByRole("link", { name: "Request service", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", { name: /^Service needed/ }),
  ).toHaveValue("cooling");
  await expect(name).toHaveValue("Morgan Preview");
  await expect(phone).toHaveValue("+1 (346) 555-0188");
  await expect(description).toHaveValue(
    "Please discuss the equipment at our property.",
  );
  await expect(
    page.getByRole("combobox", { name: /^Property type/ }),
  ).toHaveValue("Multifamily");
  expect(
    errors,
    "Hero interaction must not introduce runtime or hydration errors",
  ).toEqual([]);
});

test("Design 2: reduced motion leaves the hero settled after changing comfort choices", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page, "/design-2");
  const hero = page.locator("main section").first();
  await hero
    .getByRole("button", { name: "Warm things up", exact: true })
    .click();
  await expect(
    hero.getByRole("button", { name: "Warm things up", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(hero.getByRole("heading", { level: 1 })).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(
    hero.getByRole("link", { name: "Request service", exact: true }),
  ).toBeVisible();
  await expect
    .poll(
      () =>
        hero.evaluate(
          (element) =>
            element.getAnimations({ subtree: true }).filter((animation) => {
              if (animation.playState !== "running") return false;
              const duration = animation.effect?.getComputedTiming().duration;
              return typeof duration === "number" && duration > 20;
            }).length,
        ),
      { message: "Reduced motion must not leave a running hero animation" },
    )
    .toBe(0);
  await expectReadableHeroHeading(hero);
});

for (const concept of concepts) {
  test(`${concept.design}: primary content and contact anchors work without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      reducedMotion: "reduce",
      viewport: { width: 375, height: 812 },
      baseURL,
    });
    try {
      const page = await context.newPage();
      await ready(page, concept.path);
      const hero = page.locator("main section").first();
      await expectReadableHeroHeading(hero);
      const call = hero.getByRole("link", {
        name: "Call 346-946-7577",
        exact: true,
      });
      await expect(call).toBeVisible();
      await expect(call).toHaveAttribute("href", "tel:+13469467577");
      const request = hero.getByRole("link", {
        name: "Request service",
        exact: true,
      });
      await expect(request).toHaveAttribute("href", "#contact");
      await request.click();
      await expect(page).toHaveURL(/#contact$/);
      await expect(
        page.getByRole("textbox", { name: /^Your name/ }),
      ).toBeVisible();
    } finally {
      await context.close();
    }
  });

  test(`${concept.design}: reduced motion keeps primary content immediately available`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await ready(page, concept.path);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
    const hero = page.locator("main section").first();
    await expect(hero.getByRole("heading", { level: 1 })).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(
      hero.getByRole("link", { name: "Request service", exact: true }),
    ).toBeVisible();
    await expect(
      hero.getByRole("link", { name: "Call 346-946-7577", exact: true }),
    ).toBeVisible();
  });

  test(`${concept.design}: mobile quick actions make room for an active form`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await ready(page, concept.path);
    const quickCall = page.getByRole("link", { name: "Call", exact: true });
    await expect(quickCall).toBeVisible();
    await expect(quickCall).toHaveAttribute("href", "tel:+13469467577");
    const name = page.getByRole("textbox", { name: /^Your name/ });
    await name.focus();
    await expect(quickCall).toBeHidden();
    await name.fill("Taylor Preview");
    const box = await name.boundingBox();
    expect(box).not.toBeNull();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("textbox", { name: /^Phone number/ }),
    ).toBeFocused();
  });
}

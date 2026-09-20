import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const experiments = readdirSync(".", { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(`${entry.name}/js/translations.js`))
  .map((entry) => entry.name);

const pages = [
  { html: "index.html", scripts: ["js/hub.js"], translations: "../js/translations.js" },
  ...experiments.map((name) => ({
    html: `${name}/index.html`,
    scripts: [`${name}/js/main.js`],
    translations: `../${name}/js/translations.js`,
  })),
];

function keysUsedIn(page) {
  const keys = new Set();
  for (const source of [page.html, ...page.scripts].map((path) => readFileSync(path, "utf8"))) {
    for (const match of source.matchAll(/data-i18n(?:-aria-label)?="([^"{}]+)"/g)) keys.add(match[1]);
    for (const match of source.matchAll(/translate\("([^"{}]+)"/g)) keys.add(match[1]);
  }
  return [...keys];
}

for (const page of pages) {
  test(`${page.html} uses only keys that both languages define`, async () => {
    const { translations } = await import(page.translations);
    for (const key of keysUsedIn(page)) {
      assert.ok(key in translations.en, `"${key}" missing from English`);
      assert.ok(key in translations.ar, `"${key}" missing from Arabic`);
    }
  });

  test(`${page.html} defines the same keys in both languages`, async () => {
    const { translations } = await import(page.translations);
    assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.ar).sort());
  });
}

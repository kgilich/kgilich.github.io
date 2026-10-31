// Vygeneruje náhledy referencí (src/_data/references.json → pole "image").
// Náhled je první obrazovka webu na desktopu (1280×800), uložená v polovičním rozlišení.
// Spuštění: npm run screenshots   (přepíše existující náhledy)
import { mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Launcher } from 'chrome-launcher';
import puppeteer from 'puppeteer-core';

const refs = JSON.parse(await readFile('src/_data/references.json', 'utf8'));
const executablePath = process.env.CHROME_PATH || Launcher.getInstallations()[0];
const browser = await puppeteer.launch({ executablePath });

try {
    for (const ref of refs.filter((r) => r.image)) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 0.5 });
        await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
        await page.goto(ref.url, { waitUntil: 'networkidle0', timeout: 60_000 });
        await new Promise((r) => setTimeout(r, 1000)); // doběhnutí úvodních animací

        const path = `src${ref.image}`;
        await mkdir(dirname(path), { recursive: true });
        await page.screenshot({ path, type: 'webp', quality: 80 });
        console.log(`✓ ${ref.title} → ${path}`);
        await page.close();
    }
} finally {
    await browser.close();
}

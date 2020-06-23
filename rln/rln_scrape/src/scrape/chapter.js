import fs from 'fs-extra';

const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36`;
const WAIT_FOR_ELEMENT = 'body.loaded';

const CHAPTER_CONTENT_SELECTOR = `.container .chapter-content3`;

/**
 * Scrapes all chapter html, regardless of whether the data is needed
 */
export async function scrapeNovelChapterHTML({ page, data }) {
  const { url, filename } = data;

  page.on('error', (e) => {
    throw e;
  });

  await page.setUserAgent(USER_AGENT);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForSelector(WAIT_FOR_ELEMENT);

  const html = await page.evaluate(
    `document.querySelector('${CHAPTER_CONTENT_SELECTOR}').innerHTML`
  );
  
  await fs.ensureFile(filename);
  await fs.writeFile(filename, JSON.stringify({ html }));
}

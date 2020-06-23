import fs from 'fs-extra';
import LOG from '../util/logger';

const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36`;
const WAIT_FOR_ELEMENT = 'body.loaded';

const NOVEL_INFO_SELECTOR = `.container .novel`;

const NOVEL_CHAPTER_INFO_SELECTOR = `.container .chapters`;

/**
 * Scrapes all novel info html, regardless of whether the data is needed
 */
export async function scrapeNovelHTML({ page, data }) {
  const { idx, novelInfo, title, link, filename } = data;
  page.on('error', (e) => {
    throw e;
  });

  await page.setUserAgent(USER_AGENT);
  await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForSelector(WAIT_FOR_ELEMENT);

  LOG.info(`[${idx + 1}/${novelInfo.length}] - Attempting to save - ${title}`);

  const info = await page.evaluate(`document.querySelector('${NOVEL_INFO_SELECTOR}').innerHTML`);
  const chapters = await page.evaluate(
    `document.querySelector('${NOVEL_CHAPTER_INFO_SELECTOR}').innerHTML`
  );

  await fs.ensureFile(filename);
  await fs.writeFile(filename, JSON.stringify({ title, info, chapters }));

  LOG.info(`[${idx + 1}/${novelInfo.length}] - Successfully saved - ${title}`);
}

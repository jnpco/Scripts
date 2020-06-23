import fs from 'fs-extra';
import path from 'path';
import { Cluster } from 'puppeteer-cluster';
import { slugify } from '../util/slugify';
import { scrapeNovelHTML } from '../scrape/novel';
import LOG from '../util/logger';

export const NOVEL_ROOT_FILENAME = 'root.json';
const NOVEL_DATA_DIR = path.resolve(__dirname, '..', '..', 'data');

export async function queueScrapeNovel(novelInfo = []) {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5
  });

  await cluster.task(async (args) => {
    await scrapeNovelHTML(args);
  });

  for (let i = 0; i < novelInfo.length; i++) {
    const { title, link } = novelInfo[i];
    const filename = path.resolve(
      __dirname,
      NOVEL_DATA_DIR,
      `${slugify(title)}`,
      NOVEL_ROOT_FILENAME
    );

    if (fs.existsSync(filename)) {
      LOG.info(`[${i + 1}/${novelInfo.length}] - Existing key ${title}. Skipping...`);
      continue;
    }
    cluster.queue({ idx: i, novelInfo, title, link, filename });
  }

  await cluster.idle();
  await cluster.close();
}

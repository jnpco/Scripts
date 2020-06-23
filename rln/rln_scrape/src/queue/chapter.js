import path from 'path';
import { Cluster } from 'puppeteer-cluster';
import { slugify } from '../util/slugify';
import { scrapeNovelChapterHTML } from '../scrape/chapter';
import { getAllFiles } from '../util/file';

const NOVEL_REL_DATA_DIR_ROOT = path.resolve(__dirname, '..', '..', 'data');

const date = new Date();
const DATE_DIR = `${date.getUTCFullYear()}_${date.getUTCMonth() + 1}_${date.getUTCDate()}`;

export async function queueScrapeChapter(novelTitle, chapterLinks = []) {
  const chapterRootPath = path.resolve(NOVEL_REL_DATA_DIR_ROOT, slugify(novelTitle));
  const existingChapters = getAllFiles(chapterRootPath, true).map(p => path.basename(p));

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    monitor: true
  });

  await cluster.task(async (args) => {
    await scrapeNovelChapterHTML(args);
  });

  for (let i = 0; i < chapterLinks.length; i++) {
    const url = chapterLinks[i];
    const key = chapterLinks[i].replace(/https?:\/\//gi, '').split(/\//).slice(2);

    const chapterKey = `ch_${key.map(k => slugify(k)).join('@')}.json`;

    const filename = path.resolve(
      chapterRootPath,
      DATE_DIR,
      chapterKey
    );

    if (existingChapters.includes(chapterKey)) continue;
    cluster.queue({ url, filename });
  }

  await cluster.idle();
  await cluster.close();
}

import fs from 'fs-extra';
import path from 'path';
import LOG from './util/logger';
import yargs from 'yargs';

import { queueScrapeNovel, NOVEL_ROOT_FILENAME } from './queue/novel';
import { getAllDir, aggregateJSONFiles } from './util/file';
import { extractChapterLinks, extractChapterData } from './extract/chapter';
import { queueScrapeChapter } from './queue/chapter';
import { extractNovel } from './extract/novel';
import { capitalize } from './util/string';

// novel listings
// GET RLN NOVEL LISTINGS / LINK MAPS - go to listings page
//  - copy($('.list-by-word-body').toArray().map(el => ($(el).find('ul li').toArray()) ).reduce((acc, curr) => [...acc, ...curr], []) .map(n => ({ title: $(n).find('> a').text(), link: $(n).find('> a').attr('href') })) .filter(c => (c.link != '#') && (c.link != '#!')))

// CLI COMMANDS
// ex: node -r esm src --output="C:\Users\jnpco\Desktop\output" --update_novel_maps=false --update_chapter_maps=false --scrape="i-want-to-eat-your-pancreas;a-messed-up-wuxia-world;"
// TESTING FOR NOVELS WITH VOLUMES
// ex: node -r esm src --output="C:\Users\jnpco\Desktop\output" --update_novel_maps=false --update_chapter_maps=true --scrape="death-march-kara-hajimaru-isekai-kyusoukyoku-wn"

const NOVEL_SCRAPE_MAP_FILENAME = 'novel-listing.json';
const NOVEL_DATA_DIR = path.resolve(__dirname, '..', 'data');

const { update_novel_maps, update_chapter_maps, scrape, output=path.resolve(__dirname, '..', 'output') } = yargs.argv;

async function main() {
  if (update_novel_maps === 'true') {
    const novelScrapeMap = JSON.parse(fs.readFileSync(path.resolve(NOVEL_SCRAPE_MAP_FILENAME)));
    await queueScrapeNovel(novelScrapeMap);
  }

  if (scrape && scrape.length) {
    let novels = getAllDir(NOVEL_DATA_DIR).map(p => path.basename(p));
    if(scrape !== '*') novels = novels.filter(n => scrape.split(/;/gi).filter(s => s).includes(n));

    for(let i = 0; i < novels.length; i++) {
      const cwd = path.resolve(NOVEL_DATA_DIR, novels[i]);
      const { title, info, chapters } = JSON.parse(fs.readFileSync(path.resolve(cwd, NOVEL_ROOT_FILENAME)));

      if(update_chapter_maps === 'true') {
        const chapterLinks = extractChapterLinks(chapters);
        await queueScrapeChapter(title, chapterLinks);
      }

      await fs.ensureDir(output);

      const res = {
        title,
        ...extractNovel(info),
        chapters: aggregateJSONFiles(cwd, /ch_.*/)
          .filter(({ filepath }) => 
            !(path.basename(filepath, '.json').includes('root')))
          .map(({ data, filepath }) => {
            const pathInfo = path.basename(filepath, '.json').replace('ch_', '').split(/@/);
            
            const title = capitalize(pathInfo.pop().replace(/-/, ' '));
            const volume = pathInfo.length ? capitalize(pathInfo.pop().replace(/-/, ' ')) : null;

            return { 
              title, volume, 
              ...extractChapterData(data.html) 
            }
          })
      }

      const outputDir = path.resolve(output, `${novels[i]}.json`);

      await fs.writeFile(outputDir, JSON.stringify(res));
      LOG.log(`Exported ${title} to ${outputDir}`)
    }
  }
}

main().catch(e => LOG.error(e));

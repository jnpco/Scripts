import sanitize from 'sanitize-html';
import cheerio from 'cheerio';

const CHAPTER_CONTENT_SELECTOR = '#growfoodsmart';

export function extractChapterData(html) {
  const $ = cheerio.load(html);
  let content = sanitize($(CHAPTER_CONTENT_SELECTOR).html());

  if(content.includes('<p>')) {
    content = content.replace(/<br\s*\/?>/, '').replace(/\\n/gi, '');
  } else {
    content = content
      .split(/<br\s*\/?>/)
      .replace(/<br\s*\/?>/, '').replace(/\\n/gi, '')
      .filter((nlv) => nlv)
      .reduce((acc, curr) => `${acc}<p>${curr}</p>`, '');
  }

  return { content };
}

export function extractChapterLinks(html) {
  const $ = cheerio.load(html);
  return $('.chapter-chs > li > a').toArray().map(el => $(el).attr('href'));
}
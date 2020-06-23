import cheerio from 'cheerio';
import sanitize from 'sanitize-html';

const THUMBNAIL_SELECTOR = '.novel-cover img';
const INFO_SELECTOR = '.novel-left .novel-details > .novel-detail-item';
const REL_SELECTOR = '.novel-right .novel-details > .novel-detail-item';
const DESCRIPTION_SELECTOR = '.novel-right .novel-details > .novel-detail-item';

const LABEL_SELECTOR = '.novel-detail-header h6';
const CONTENT_SELECTOR = '.novel-detail-body li';
const DESCRIPTION_CONTENT_SELECTOR = '.novel-detail-body > *';

export function extractNovel(html) {
  const $ = cheerio.load(html);
  const coverImage = $(THUMBNAIL_SELECTOR).attr('src');

  const { type, genre, tags, language, author, artist, year, status } = $(INFO_SELECTOR)
    .map((_, nl) => ({
      label: $(nl).find(LABEL_SELECTOR).text().replace('(s)', '').toLowerCase(),
      value: $(nl)
        .find(CONTENT_SELECTOR)
        .map((_, nli) => $(nli).text())
        .toArray()
    }))
    .toArray()
    .reduce((acc, curr) => ({ ...acc, [curr.label]: curr.value }), {});

  const { related_series, you_may_also_like } = $(REL_SELECTOR)
    .map((_, nl) => ({
      label: $(nl).find(LABEL_SELECTOR).text(),
      value: $(nl)
        .find(CONTENT_SELECTOR)
        .map((_, nli) => $(nli).text())
        .toArray()
    }))
    .toArray()
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr.label.replace('(s)', '').replace(/\s+/g, '_').toLowerCase()]: curr.value
      }),
      {}
    );

  const { description } = $(DESCRIPTION_SELECTOR)
    .map((_, nl) => ({
      label: $(nl).find(LABEL_SELECTOR).text(),
      value: $(nl)
        .find(DESCRIPTION_CONTENT_SELECTOR)
        .toArray()
        .map((a) => $(a).html())
    }))
    .toArray()
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr.label.replace('(s)', '').replace(/\s+/g, '_').toLowerCase()]: curr.value
          .map((nlv) =>
            sanitize(nlv)
              .split(/<br\s*\/?>/)
              .filter((nlv) => nlv)
          )
          .reduce((acc, curr) => [...acc, ...curr], [])
      }),
      {}
    );

  const novel = {
    description,
    type,
    coverImage,
    tags,
    genres: genre,
    origins: language,
    authors: author,
    artists: artist,
    relatedNovels: related_series,
    recommendedNovels: you_may_also_like,
    year,
    status,
  }

  if(novel.description) novel.description = novel.description.reduce((acc, curr) => `${acc}<p>${curr}</p>`, '');

  const ARRAY_KEYS = ['tags', 'genres', 'origins', 'authors', 'artists', 'relatedNovels', 'recommendedNovels'];

  Object.keys(novel).forEach(k => {
    if(
      (Array.isArray(novel[k]) && (!novel[k].length || novel[k].map(n => n.toLowerCase()).includes('n/a'))) ||
      (typeof novel[k] === 'string' && novel[k].toLowerCase() === 'n/a') ||
      (!k || !novel[k])
    ) delete novel[k];
    else if(typeof novel[k] === 'string' && novel[k].toLowerCase() === 'n/a') delete[novel[k]];
    if(!ARRAY_KEYS.includes(k) && Array.isArray(novel[k])) novel[k] = novel[k][0];
  });

  if(novel.year) novel.year = novel.year >> 0;
  if(novel.type) novel.type = novel.type.replace(/ [nN]ovel/gi, '')

  return novel;
}

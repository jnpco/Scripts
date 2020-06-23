const fs = require('fs-extra');
const path = require('path');
const log4js = require('log4js')
const fetch = require('node-fetch');

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, '');
  str = str.toLowerCase();

  const swaps = {
    '0': ['°', '₀', '۰', '０'],
    '1': ['¹', '₁', '۱', '１'],
    '2': ['²', '₂', '۲', '２'],
    '3': ['³', '₃', '۳', '３'],
    '4': ['⁴', '₄', '۴', '٤', '４'],
    '5': ['⁵', '₅', '۵', '٥', '５'],
    '6': ['⁶', '₆', '۶', '٦', '６'],
    '7': ['⁷', '₇', '۷', '７'],
    '8': ['⁸', '₈', '۸', '８'],
    '9': ['⁹', '₉', '۹', '９'],
    a: [ 
      'à', 'á', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 
      'ẵ', 'ặ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ', 'ā', 
      'ą', 'å', 'α', 'ά', 'ἀ', 'ἁ', 'ἂ', 'ἃ', 'ἄ', 
      'ἅ', 'ἆ', 'ἇ', 'ᾀ', 'ᾁ', 'ᾂ', 'ᾃ', 'ᾄ', 'ᾅ', 
      'ᾆ', 'ᾇ', 'ὰ', 'ά', 'ᾰ', 'ᾱ', 'ᾲ', 'ᾳ', 'ᾴ', 
      'ᾶ', 'ᾷ', 'а', 'أ', 'အ', 'ာ', 'ါ', 'ǻ', 'ǎ', 
      'ª', 'ა', 'अ', 'ا', 'ａ', 'ä'
    ],
    b: ['б', 'β', 'ب', 'ဗ', 'ბ', 'ｂ'],
    c: ['ç', 'ć', 'č', 'ĉ', 'ċ', 'ｃ'],
    d: ['ď', 'ð', 'đ', 'ƌ', 'ȡ', 'ɖ', 'ɗ', 'ᵭ', 'ᶁ', 'ᶑ', 'д', 'δ', 'د', 'ض', 'ဍ', 'ဒ', 'დ', 'ｄ'],
    e: [ 
      'é', 'è', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 
      'ễ', 'ệ', 'ë', 'ē', 'ę', 'ě', 'ĕ', 'ė', 'ε', 
      'έ', 'ἐ', 'ἑ', 'ἒ', 'ἓ', 'ἔ', 'ἕ', 'ὲ', 'έ', 
      'е', 'ё', 'э', 'є', 'ə', 'ဧ', 'ေ', 'ဲ', 'ე', 
      'ए', 'إ', 'ئ', 'ｅ'
    ],
    f: ['ф', 'φ', 'ف', 'ƒ', 'ფ', 'ｆ'],
    g: ['ĝ', 'ğ', 'ġ', 'ģ', 'г', 'ґ', 'γ', 'ဂ', 'გ', 'گ', 'ｇ'],
    h: ['ĥ', 'ħ', 'η', 'ή', 'ح', 'ه', 'ဟ', 'ှ', 'ჰ', 'ｈ'],
    i: [ 
      'í', 'ì', 'ỉ', 'ĩ', 'ị', 'î', 'ï', 'ī', 'ĭ', 
      'į', 'ı', 'ι', 'ί', 'ϊ', 'ΐ', 'ἰ', 'ἱ', 'ἲ', 
      'ἳ', 'ἴ', 'ἵ', 'ἶ', 'ἷ', 'ὶ', 'ί', 'ῐ', 'ῑ', 
      'ῒ', 'ΐ', 'ῖ', 'ῗ', 'і', 'ї', 'и', 'ဣ', 'ိ', 
      'ီ', 'ည်', 'ǐ', 'ი', 'इ', 'ی', 'ｉ'
    ],
    j: ['ĵ', 'ј', 'Ј', 'ჯ', 'ج', 'ｊ'],
    k: ['ķ', 'ĸ', 'к', 'κ', 'Ķ', 'ق', 'ك', 'က', 'კ', 'ქ', 'ک', 'ｋ'],
    l: ['ł', 'ľ', 'ĺ', 'ļ', 'ŀ', 'л', 'λ', 'ل', 'လ', 'ლ', 'ｌ'],
    m: ['м', 'μ', 'م', 'မ', 'მ', 'ｍ'],
    n: ['ñ', 'ń', 'ň', 'ņ', 'ŉ', 'ŋ', 'ν', 'н', 'ن', 'န', 'ნ', 'ｎ'],
    o: [ 
      'ó', 'ò', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 
      'ỗ', 'ộ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ', 'ø', 
      'ō', 'ő', 'ŏ', 'ο', 'ὀ', 'ὁ', 'ὂ', 'ὃ', 'ὄ', 
      'ὅ', 'ὸ', 'ό', 'о', 'و', 'θ', 'ို', 'ǒ', 'ǿ', 
      'º', 'ო', 'ओ', 'ｏ', 'ö'
    ],
    p: ['п', 'π', 'ပ', 'პ', 'پ', 'ｐ'],
    q: ['ყ', 'ｑ'],
    r: ['ŕ', 'ř', 'ŗ', 'р', 'ρ', 'ر', 'რ', 'ｒ'],
    s: ['ś', 'š', 'ş', 'с', 'σ', 'ș', 'ς', 'س', 'ص', 'စ', 'ſ', 'ს', 'ｓ'],
    t: ['ť', 'ţ', 'т', 'τ', 'ț', 'ت', 'ط', 'ဋ', 'တ', 'ŧ', 'თ', 'ტ', 'ｔ'],
    u: [ 
      'ú', 'ù', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 
      'ữ', 'ự', 'û', 'ū', 'ů', 'ű', 'ŭ', 'ų', 'µ', 
      'у', 'ဉ', 'ု', 'ူ', 'ǔ', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 
      'უ', 'उ', 'ｕ', 'ў', 'ü'
    ],
    v: ['в', 'ვ', 'ϐ', 'ｖ'],
    w: ['ŵ', 'ω', 'ώ', 'ဝ', 'ွ', 'ｗ'],
    x: ['χ', 'ξ', 'ｘ'],
    y: ['ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ', 'ÿ', 'ŷ', 'й', 'ы', 'υ', 'ϋ', 'ύ', 'ΰ', 'ي', 'ယ', 'ｙ'],
    z: ['ź', 'ž', 'ż', 'з', 'ζ', 'ز', 'ဇ', 'ზ', 'ｚ'],
    aa: ['ع', 'आ', 'آ'],
    ae: ['æ', 'ǽ'],
    ai: ['ऐ'],
    ch: ['ч', 'ჩ', 'ჭ', 'چ'],
    dj: ['ђ', 'đ'],
    dz: ['џ', 'ძ'],
    ei: ['ऍ'],
    gh: ['غ', 'ღ'],
    ii: ['ई'],
    ij: ['ĳ'],
    kh: ['х', 'خ', 'ხ'],
    lj: ['љ'],
    nj: ['њ'],
    oe: ['ö', 'œ', 'ؤ'],
    oi: ['ऑ'],
    oii: ['ऒ'],
    ps: ['ψ'],
    sh: ['ш', 'შ', 'ش'],
    shch: ['щ'],
    ss: ['ß'],
    sx: ['ŝ'],
    th: ['þ', 'ϑ', 'ث', 'ذ', 'ظ'],
    ts: ['ц', 'ც', 'წ'],
    ue: ['ü'],
    uu: ['ऊ'],
    ya: ['я'],
    yu: ['ю'],
    zh: ['ж', 'ჟ', 'ژ'],
    '(c)': ['©'],
    A: [ 
      'Á', 'À', 'Ả', 'Ã', 'Ạ', 'Ă', 'Ắ', 'Ằ', 'Ẳ', 
      'Ẵ', 'Ặ', 'Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ', 'Å', 
      'Ā', 'Ą', 'Α', 'Ά', 'Ἀ', 'Ἁ', 'Ἂ', 'Ἃ', 'Ἄ', 
      'Ἅ', 'Ἆ', 'Ἇ', 'ᾈ', 'ᾉ', 'ᾊ', 'ᾋ', 'ᾌ', 'ᾍ', 
      'ᾎ', 'ᾏ', 'Ᾰ', 'Ᾱ', 'Ὰ', 'Ά', 'ᾼ', 'А', 'Ǻ', 
      'Ǎ', 'Ａ', 'Ä'
    ],
    B: ['Б', 'Β', 'ब', 'Ｂ'],
    C: ['Ç', 'Ć', 'Č', 'Ĉ', 'Ċ', 'Ｃ'],
    D: ['Ď', 'Ð', 'Đ', 'Ɖ', 'Ɗ', 'Ƌ', 'ᴅ', 'ᴆ', 'Д', 'Δ', 'Ｄ'],
    E: [ 
      'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ', 'Ê', 'Ế', 'Ề', 'Ể', 
      'Ễ', 'Ệ', 'Ë', 'Ē', 'Ę', 'Ě', 'Ĕ', 'Ė', 'Ε', 
      'Έ', 'Ἐ', 'Ἑ', 'Ἒ', 'Ἓ', 'Ἔ', 'Ἕ', 'Έ', 'Ὲ', 
      'Е', 'Ё', 'Э', 'Є', 'Ə', 'Ｅ'
    ],
    F: ['Ф', 'Φ', 'Ｆ'],
    G: ['Ğ', 'Ġ', 'Ģ', 'Г', 'Ґ', 'Γ', 'Ｇ'],
    H: ['Η', 'Ή', 'Ħ', 'Ｈ'],
    I: [ 
      'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị', 'Î', 'Ï', 'Ī', 'Ĭ', 
      'Į', 'İ', 'Ι', 'Ί', 'Ϊ', 'Ἰ', 'Ἱ', 'Ἳ', 'Ἴ', 
      'Ἵ', 'Ἶ', 'Ἷ', 'Ῐ', 'Ῑ', 'Ὶ', 'Ί', 'И', 'І', 
      'Ї', 'Ǐ', 'ϒ', 'Ｉ'
    ],
    J: ['Ｊ'],
    K: ['К', 'Κ', 'Ｋ'],
    L: ['Ĺ', 'Ł', 'Л', 'Λ', 'Ļ', 'Ľ', 'Ŀ', 'ल', 'Ｌ'],
    M: ['М', 'Μ', 'Ｍ'],
    N: ['Ń', 'Ñ', 'Ň', 'Ņ', 'Ŋ', 'Н', 'Ν', 'Ｎ'],
    O: [ 
      'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ', 'Ô', 'Ố', 'Ồ', 'Ổ', 
      'Ỗ', 'Ộ', 'Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ', 'Ø', 
      'Ō', 'Ő', 'Ŏ', 'Ο', 'Ό', 'Ὀ', 'Ὁ', 'Ὂ', 'Ὃ', 
      'Ὄ', 'Ὅ', 'Ὸ', 'Ό', 'О', 'Θ', 'Ө', 'Ǒ', 'Ǿ', 
      'Ｏ', 'Ö'
    ],
    P: ['П', 'Π', 'Ｐ'],
    Q: ['Ｑ'],
    R: ['Ř', 'Ŕ', 'Р', 'Ρ', 'Ŗ', 'Ｒ'],
    S: ['Ş', 'Ŝ', 'Ș', 'Š', 'Ś', 'С', 'Σ', 'Ｓ'],
    T: ['Ť', 'Ţ', 'Ŧ', 'Ț', 'Т', 'Τ', 'Ｔ'],
    U: [ 
      'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ', 'Ư', 'Ứ', 'Ừ', 'Ử', 
      'Ữ', 'Ự', 'Û', 'Ū', 'Ů', 'Ű', 'Ŭ', 'Ų', 'У', 
      'Ǔ', 'Ǖ', 'Ǘ', 'Ǚ', 'Ǜ', 'Ｕ', 'Ў', 'Ü'
    ],
    V: ['В', 'Ｖ'],
    W: ['Ω', 'Ώ', 'Ŵ', 'Ｗ'],
    X: ['Χ', 'Ξ', 'Ｘ'],
    Y: ['Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ', 'Ÿ', 'Ῠ', 'Ῡ', 'Ὺ', 'Ύ', 'Ы', 'Й', 'Υ', 'Ϋ', 'Ŷ', 'Ｙ'],
    Z: ['Ź', 'Ž', 'Ż', 'З', 'Ζ', 'Ｚ'],
    AE: ['Æ', 'Ǽ'],
    Ch: ['Ч'],
    Dj: ['Ђ'],
    Dz: ['Џ'],
    Gx: ['Ĝ'],
    Hx: ['Ĥ'],
    Ij: ['Ĳ'],
    Jx: ['Ĵ'],
    Kh: ['Х'],
    Lj: ['Љ'],
    Nj: ['Њ'],
    Oe: ['Œ'],
    Ps: ['Ψ'],
    Sh: ['Ш'],
    Shch: ['Щ'],
    Ss: ['ẞ'],
    Th: ['Þ'],
    Ts: ['Ц'],
    Ya: ['Я'],
    Yu: ['Ю'],
    Zh: ['Ж']
  };

  Object.keys(swaps).forEach((swap) =>
    swaps[swap].forEach((s) => (str = str.replace(new RegExp(s, 'g'), swap)))
  );

  return str
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

log4js.configure({
  appenders: {
    all: { type: 'file', filename: `./logs/rln/log.log` },
    errors: { type: 'file', filename: `./logs/rln/error.log`},
    errorsFilter: { type: 'logLevelFilter', appender: 'errors', level: 'error' }
  },
  categories: { 
    default: { appenders: ['all', 'errorsFilter'] , level: 'debug'}
  }
});

const LOG = log4js.getLogger();

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBMndHYlROVXdQS2NSeHZKUE0xNmEiLCJyb2xlIjoiT1dORVIiLCJpYXQiOjE1OTA1NDkyOTEsImV4cCI6MTU5MDgwODQ5MX0.3AnBVG9vQZkTxw4pDApsUVCiKJl0FhGO409WbcWIzEk';
const GQL_ENDPOINT = 'http://localhost:5000/graphql';
const OUTPUT_SRC = path.resolve(__dirname, 'output');

const getNovelQuery = `
  query($slug: String!) {
    novelBySlug(slug: $slug) {
      id
      title
    }
  }
`;

const createNovelQuery = `
  mutation($data: NovelInput!) {
    novelCreate(data: $data) {
      id
      title
    }
  }
`;

const updateNovelQuery = `
  mutation($id: ID!, $data: NovelInput!) {
    novelUpdate(id: $id, data: $data) {
      id
      title
    }
  }
`;

const getChapterQuery = `
  query($novelId: String!, $idx: Float!) {
    chapterByIdx(novelId: $novelId, idx: $idx){
      id
      title
    }
  }
`;

const getSortedChaptersQuery = `
  query($first: Float!) {
    chapters(first: $first, sortKey: "idx") {
      edges {
        node {
          id
          idx
          title
        }
      }
    }
  }
`;

const createChapterQuery = `
  mutation($data: ChapterInput!) {
    chapterCreate(data: $data) {
      id
      title
    }
  }
`;

const updateChapterQuery = `
  mutation($id: ID!, $data: ChapterInput!) {
    chapterUpdate(id: $id, data: $data) {
      id
      title
    }
  }
`; 

function getAllFiles(dir, recursive=false, fileArr=[]) {
  const entity = fs.readdirSync(dir);

  entity.forEach(e => {
    const currentPath = path.resolve(dir, e);

    if(recursive && fs.statSync(currentPath).isDirectory()) {
      fileArr = getAllFiles(currentPath, true, fileArr);
    } else if(fs.statSync(currentPath).isFile()) {
      fileArr.push(path.resolve(__dirname, currentPath))
    }
  });

  return fileArr;
}

async function createQuery(body) {
  return await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ACCESS_TOKEN}` },
    body
  });
}

async function main() {
  const files = getAllFiles(OUTPUT_SRC);

  for(const file of files){
    const { chapters, recommendedNovels, alternativeNames, ...novel } = JSON.parse(fs.readFileSync(file));
    Object.keys(novel).forEach(k => { if(Array.isArray(novel[k])) novel[k] = JSON.stringify(novel[k]) });

    try {
      const novelInput = novel;

      const novelExistsRes = await createQuery(JSON.stringify({ query: getNovelQuery, variables: { slug: slugify(novelInput.title) } }));
      const { data: novelExistsData, errors: novelExistsError } = await novelExistsRes.json();
      let novelId = null;

      if(novelExistsError) throw new Error(JSON.stringify(novelExistsError[0].extensions.exception, null, 2))

      if(novelExistsData && novelExistsData.novelBySlug && novelExistsData.novelBySlug.id) {
        novelId = novelExistsData.novelBySlug.id;
        await createQuery(JSON.stringify({ query: updateNovelQuery, variables: { id: novelId, data: novelInput } }));
        LOG.info(`Updated novel ${novelId} ${novelInput.title}`);
      } else {
        const novelCreateRes = await createQuery(JSON.stringify({ query: createNovelQuery, variables: { data: novelInput } }));
        const { data: novelCreateData, errors: novelCreateErrors } = await novelCreateRes.json();
        
        if(novelCreateErrors) throw new Error(JSON.stringify(novelCreateErrors[0].extensions.exception, null, 2))

        if(novelCreateData.novelCreate && novelCreateData.novelCreate.id) novelId = novelCreateData.novelCreate.id;
        else throw new Error('Something went wrong with novel create');
        LOG.info(`Created novel ${novelId} ${novelInput.title}`);
      }
      
      LOG.info(`Successfully imported ${novelInput.title}`);

      if(novelId) {
        for(const chapter of chapters) {
          const chapterInput = chapter;
          chapterInput.novelId = novelId;
          chapterInput.idx = chapter.title.split('chapter-').pop() >> 0;
          chapterInput.title = chapterInput.title.includes('chapter-') ? chapterInput.title.replace('chapter-', 'Chapter ') : chapter.title;
          
          const chapterExistsRes = await createQuery(JSON.stringify({ query: getChapterQuery, variables: { novelId, idx: chapterInput.idx } }));
          const { data: chapterExistsData, errors: chapterExistsError } = await chapterExistsRes.json();

          if(chapterExistsError) throw new Error(JSON.stringify(chapterExistsError[0].extensions.exception, null, 2))

          if(chapterExistsData && chapterExistsData.chapterByIdx && chapterExistsData.chapterByIdx.id) {
            // only add previous and next if chapters exists
            chapterId = chapterExistsData.chapterByIdx.id;

            await createQuery(JSON.stringify({ query: updateChapterQuery, variables: { id: chapterId, data: chapterInput } }));
            LOG.info(`Updated chapter ${chapterId} ${chapterInput.title}`);
          } else {
            const chapterCreateRes = await createQuery(JSON.stringify({ query: createChapterQuery, variables: { data: chapterInput } }));
            const { data: chapterCreateData, errors: chapterCreateErrors } = await chapterCreateRes.json();
            
            if(chapterCreateErrors) throw new Error(JSON.stringify(chapterCreateErrors[0].extensions.exception, null, 2))

            if(chapterCreateData.chapterCreate && chapterCreateData.chapterCreate.id) chapterId = chapterCreateData.chapterCreate.id;
            else throw new Error('Something went wrong with chapter create');
            LOG.info(`Created chapter ${chapterId} ${chapterInput.title}`);
          }
          
          LOG.info(`Successfully imported ${novel.title} - ${chapterInput.title}`);
        }

        const sortedChaptersRes = await createQuery(JSON.stringify({ query: getSortedChaptersQuery, variables: { first: 15000 } }));
        const { data: sortedChaptersData, errors: sortedChaptersError } = await sortedChaptersRes.json();

        if(sortedChaptersError) throw new Error(JSON.stringify(sortedChaptersError[0].extensions.exception, null, 2));
        if(sortedChaptersData && sortedChaptersData.chapters) {
          const chapters = sortedChaptersData.chapters.edges.map(({ node }) => node);
          for(let i = 0; i < chapters.length; i++) {
            const chapterInput = { novelId, title: chapters[i].title, idx: chapters[i].idx };

            if(chapters[i - 1]) chapterInput.previousId = chapters[i - 1].id;
            if(chapters[i + 1]) chapterInput.nextId = chapters[i + 1].id;

            await createQuery(JSON.stringify({ query: updateChapterQuery, variables: { id: chapters[i].id, data: chapterInput } }));
            LOG.info(`Updated pagination for chapter ${chapterInput.id} ${chapterInput.title}`)
          }
        }
      }
    } catch(e) {
      console.log(e)
      continue;
    }
  }
}

main().catch(e => LOG.error(e));
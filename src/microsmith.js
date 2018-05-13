const compileSass = require('./lib/sass-compile');
const copyFiles = require('./lib/copy-files');

const stylesSource = './assets/styles.scss';
const stylesDestination = './dist/styles.css';

const sourcePath = '../posts';
const buildDistPath = '../dist';
const buildFinalPath = '../';
const templatePath = '../templates'

const websiteOptions = { metadata: require('../microsmith.config.json') };

(async () => {

  const datefns = require('date-fns');
  const Handlebars = require('handlebars');
  const handlebars_layouts = require('handlebars-layouts');

  Handlebars.registerHelper('json', function (obj) {
    try {
      const json = JSON.stringify(obj, null, 2);
      return new Handlebars.SafeString(Handlebars.Utils.escapeExpression(json));
    } catch (e) {
      if (obj) {
        const str = require('util').inspect(obj, {showHidden: false, depth: 3});
        return new Handlebars.SafeString(str);
      }
      return new Handlebars.SafeString(`[object object]`);
    }
  });

  Handlebars.registerHelper('datefn', (dateObj, ...formatOpts) => {
    let format;
    let datefnsOpts;
    if (formatOpts.length > 1) {
      format = formatOpts[0];
    }
    if (formatOpts.length > 2) {
      datefnsOpts = formatOpts[1];
    }
    const date = datefns.format(dateObj, format, datefnsOpts);
    return new Handlebars.SafeString(date);
  });


  websiteOptions.metadata.site.lastBuildDate = new Date();
  websiteOptions.metadata.site.copyrightYear = new Date().getFullYear();
  websiteOptions.metadata.site.lastBuild = new Date().toISOString();
  websiteOptions.metadata.author.emailMd5 = require('crypto').createHash('md5').update(websiteOptions.metadata.author.email).digest("hex");

  const Metalsmith = require('metalsmith');
  const mp_collections = require('metalsmith-collections');
  const mp_excerpts = require('metalsmith-excerpts');
  const mp_feed = require('metalsmith-feed');
  const mp_layouts = require('metalsmith-layouts');
  const mp_markdown = require('metalsmith-markdown');
  const mp_metallic = require('metalsmith-metallic');
  const mp_open_graph = require('metalsmith-open-graph');
  const mp_permalinks = require('metalsmith-permalinks');


  Metalsmith(__dirname)
    .metadata(websiteOptions.metadata)
    .source(sourcePath)
    .destination(buildDistPath)
    .clean(true)
    .use(mp_collections({
      'posts': {
        pattern: ['*.md', '!index*'],
        sortBy: 'date',
        reverse: true
      }
    }))
    .use(mp_metallic())
    .use(mp_markdown())
    .use(mp_excerpts())
    .use(mp_permalinks({
      pattern: 'posts/:date/:title',
      date: 'YYYY/MM/DD'
    }))
    .use(mp_layouts({
      engine: 'handlebars',
      directory: templatePath
    }))
    .use(mp_open_graph({
      siteurl: websiteOptions.metadata.site.url,
      title: 'title',
      description: 'description',
      image: 'image-preview'
    }))
    .use(mp_feed({
      collection: 'posts',
      destination: 'feed.xml'
    }))
    .build((err, files) => {
      if (err) { throw err; }
      compileSass(stylesSource, stylesDestination)
        .then(() => {
          // return copyFiles(buildDistPath, buildFinalPath)
          return true;
        })
        .then(() => {
          console.log(`Build done. Check ${require('path').resolve(buildDistPath, 'index.html')}`);
        })
        .catch((err) => {
          console.log(err);
          console.log('Build done. CSS failure.');
        });
    });
  return Promise.resolve();
})();

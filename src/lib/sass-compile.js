const sass = require('node-sass');
const fs = require('fs');
const src = '../assets/sass/style.scss';
const dest = '../assets/css/style.css';

module.exports = (optSrc, optDest) => {
  return new Promise((resolve, reject) => {
    sass.render({
      file: optSrc || src,
    }, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      fs.writeFileSync(optDest || dest, result.css);
      return resolve();
    });
  });
}

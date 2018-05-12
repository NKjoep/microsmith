const ncp = require('ncp').ncp;

module.exports = function moveDist(sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    ncp.limit = 16;
    // ncp(buildDistPath, '../', (err) => {
    ncp(sourcePath, destinationPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(destinationPath);
    });
  })
}

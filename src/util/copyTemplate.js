const copyTemplateDir = require('copy-template-dir');

exports.copyTemplate = function copyTemplate(inDir, outDir, option) {
  return new Promise((resolve, reject) => {
    copyTemplateDir(inDir, outDir, option, (err, createdFiles) => {
      if (err) {
        reject(new Error(err));
        return;
      }
      resolve(createdFiles);
    });
  });
};

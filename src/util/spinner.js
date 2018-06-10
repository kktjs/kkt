const loading = require('loading-cli');


const spinner = loading({});

exports.logSpinner = (msg) => {
  spinner.start(msg);
};

exports.stopSpinner = () => {
  spinner.stop();
};
exports.succeedSpinner = (text) => {
  spinner.succeed(text);
};

function parseJSON(response) {
  return response.json();
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {};
  const newOptions = { ...defaultOptions, ...options };

  newOptions.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...newOptions.headers,
  };
  newOptions.body = JSON.stringify(newOptions.body);

  return fetch(url, newOptions)
    .then(parseJSON)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      // console.log('请求错误: ', err);
      return err;
    });
}

import isEmpty from 'lodash/isEmpty';
const popsicle = require('popsicle');

function generateRequest(baseUrl = '') {
  const get = url => popsicle
    .get(baseUrl + url)
    .use(popsicle.plugins.parse('json'));

  const post = (url, body, params={}) => {
    if (!url) return console.error('No URL was specified for POST request');
    if (isEmpty(body)) return console.error('No body was given for POST request');
    url = baseUrl + url;

    const headers = {
      'Content-Type': 'application/json'
    };

    if (params.headers) {
      Object.assign(headers, params.headers);
    }

    return popsicle
      .post({ headers, url, body })
      .use(popsicle.plugins.parse('json'));
  }

  return { get, post };
};

const request = generateRequest();
const api = generateRequest('/api');

module.exports = { ...request, api };

import * as _ from 'lodash';
import * as popsicle from 'popsicle';

function generateRequest(baseUrl = '') {
  const get = url => popsicle.get(baseUrl + url).use(popsicle.plugins.parse('json'));

  const post = (url, body, params: any = {}) => {
    if (!url) {
      return console.error('No URL was specified for POST request');
    } else if (_.isEmpty(body)) {
      return console.error('No body was given for POST request');
    }

    url = baseUrl + url;

    const headers = {
      'Content-Type': 'application/json'
    };

    if (params.headers) {
      _.assign(headers, params.headers);
    }

    return popsicle.post({ headers, url, body }).use(popsicle.plugins.parse('json'));
  };

  return { get, post };
}

export default generateRequest();

const request = require('request');

const headers = {
  Host: 'server.streamavatars.com',
  'User-Agent':
    'UnityPlayer/2019.4.1f1 (UnityWebRequest/1.0, libcurl/7.52.0-DEV)',
  Accept: '*/*',
  'X-Unity-Version': '2019.4.1f1',
};

const options = {
  url: 'https://server.streamavatars.com/ext/updates/33699502',
  headers,
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
}

setInterval(() => {
  request(options, callback);
}, 500);

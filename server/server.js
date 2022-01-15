const axios = require('axios');
const request = require('request');
const unfluff = require('unfluff');
const url = "https://en.wikipedia.org/wiki/Star_Wars";

request(url, function (error, response, body) {
  data = unfluff(body)
  console.log(data.text);
});

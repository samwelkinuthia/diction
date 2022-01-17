const axios = require('axios');
const request = require('request');
const unfluff = require('unfluff');
const url = "https://en.wikipedia.org/wiki/Star_Wars";
const express = require('express');
const cors = require('cors');

request(url, function(error, response, body) {
  data = unfluff(body)
  const text = data.text.replace(/[^a-zA-Z ]/g, "")
  // console.log(sorted);
});

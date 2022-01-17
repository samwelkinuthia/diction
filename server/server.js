const axios = require('axios');
const request = require('request');
const unfluff = require('unfluff');
const url = "https://en.wikipedia.org/wiki/Star_Wars";
const express = require('express');
const cors = require('cors');



request(url, function(error, response, body) {
  data = unfluff(body)
  const text = data.text.replace(/[^a-zA-Z ]/g, "")
  const sorted = wordFreq(text)
  for (const key in sorted) {
    if (key === '') {
      delete sorted[key]
    }
    if (sorted[key] > 10) {
      console.log(`${key} : ${sorted[key]}`);
    }
  }

  const objectArr = Object.entries(sorted).map((e) => ({
    [e[0]]: e[1]
  }));
  // console.log(objectArr);
});

function wordFreq(string) {
  return string.replace(/[.]/g, '')
    .split(/\s/)
    .reduce((map, word) =>
      Object.assign(map, {
        [word]: (map[word]) ?
          map[word] + 1 : 1,
      }), {}
    );
}

const axios = require('axios');
const request = require('request');
const unfluff = require('unfluff');
const url = "https://en.wikipedia.org/wiki/Star_Wars";
const express = require('express');
const cors = require('cors');

const app = express();
const routes = express.Router();
const port = 5000;
app.use(cors());
app.use(express.json());

// get driver connection
//
// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
//

app.post("/count", (req, res) => {
  res.send('Obtained')
})

// const myObj = { you: 100, me: 75, foo: 116, bar: 15 };

// console.log((JSON.stringify(result)));

request(url, function(error, response, body) {
  data = unfluff(body)
  const text = data.text.replace(/[^a-zA-Z ]/g, "")
  const sorted = wordFreq(text)
  const arranged = sorter(sorted)

  for (const key in arranged) {
    if (key === '') {
      delete arranged[key]
    }
    if (arranged[key] > 20) {
      console.log(`${key} : ${arranged[key]}`);

    }
  }
  // console.log(sorted);
  const objectArr = Object.entries(sorted).map((e) => ({
    [e[0]]: e[1]
  }));
});

function sorter(obj) {
  const result = Object
   .entries(obj)
   .sort((a, b) => b[1] - a[1])
   .reduce((_sortedObj, [k,v]) => ({
     ..._sortedObj,
     [k]: v
   }), {});
   return result
}

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

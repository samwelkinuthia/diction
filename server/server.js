const axios = require('axios');
const request = require('request');
const unfluff = require('unfluff');
const url = "https://en.wikipedia.org/wiki/Star_Wars";
const express = require('express');
const cors = require('cors');

const app = express();
// const routes = express.Router();
const port = 5000;
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


app.post("/count", (req, res) => {
    let url = req.body.url;
    request(url, function(error, response, body) {
        let data = unfluff(body)
        const text = data.text.replace(/[^a-zA-Z ]/g, "")
        const sorted = wordFreq(text)
        const arranged = sorter(sorted)
        for (const key in arranged) {
            if (key === '') {
                delete arranged[key]
            }
            // if (arranged[key] > 2) {
            //     console.log(`${key} : ${arranged[key]}`);
            // }
        }
        res.send(arranged);
    });
})

// const myObj = { you: 100, me: 75, foo: 116, bar: 15 };

// console.log((JSON.stringify(result)));


function sorter(obj) {
    return Object
       .entries(obj)
       .sort((a, b) => b[1] - a[1])
       .reduce((_sortedObj, [k, v]) => ({
           ..._sortedObj,
           [k]: v
       }), {})
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

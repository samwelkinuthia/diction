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
    // let url2 = req.body.url2
    request(url, function(error, response, body) {
        let data = unfluff(body)
        const text = data.text.replace(/[^a-zA-Z ]/g, "")
        const wordArray = text.split(" ")
        const length = wordArray.length;
        const sorted = wordFreq(text)
        const arranged = sorter(sorted)
        for (const key in arranged) {
            if (key === '') {
                delete arranged[key]
            }
            if (arranged[key] < 2) {
                delete arranged[key]
            }
        }
        const objArr = [];
        Object.keys(arranged).forEach(key => objArr.push({
                word: key,
                count: arranged[key]
            }
        ));
        console.log(objArr)
        // console.log(res.send())
        // console.log(objArr);
        res.send({objs:objArr, dist: length});
    });
})


app.post("/count2", (req, res) => {
    let url1 = req.body.url1;
    let url2 = req.body.url2;
    // let url2 = req.body.url2
    request(url, function(error, response, body) {
        let data = unfluff(body)
        const text = data.text.replace(/[^a-zA-Z ]/g, "")
        const wordArray = text.split(" ")
        const length = wordArray.length;
        const sorted = wordFreq(text)
        const arranged = sorter(sorted)
        for (const key in arranged) {
            if (key === '') {
                delete arranged[key]
            }
            if (arranged[key] < 2) {
                delete arranged[key]
            }
        }
        const objArr = [];
        Object.keys(arranged).forEach(key => objArr.push({
                word: key,
                count: arranged[key]
            }
        ));
        console.log(objArr)
        res.send({objs:objArr, dist: length});
    });
})

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

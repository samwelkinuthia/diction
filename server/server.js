const request = require('request');
const unfluff = require('unfluff');
const url = "https://en.wikipedia.org/wiki/Star_Wars";
const express = require('express');
const cors = require('cors');
const rp = require('request-promise');

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
        console.log(sorted)
        const arranged = sorter(sorted)
        console.log(arranged)
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
        res.send({objs:objArr, dist: length});
    });
})

//empty array to hold post:/count2 results
let temp = [];

app.post("/count2", (req, res) => {
    //obtain the two URLs from client side
    let url1 = req.body.url1;
    let url2 = req.body.url2;
    console.log(url1, url2);
    //chained request promises for each URL
    rp(url1).then((htmlString) => {
        let url1_scrapped = unfluff(htmlString);
        let array1 = url1_scrapped.text.replace(/[^a-zA-Z ]/g, "").split(" ");
        temp.push(array1);
    }).then(
        rp(url2).then((htmlString) => {
            let url2_scrapped = unfluff(htmlString);
            let array2 = url2_scrapped.text.replace(/[^a-zA-Z ]/g, "").split(" ");
            temp.push(array2);
            let result = find(temp[0], temp[1]);
            res.send(result);
            console.log(result)
        })
    )
})

// frequency counter that returns an object containing words and their occurrence count
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

//returns a sorted list of the words/occurrence from most occurring to least occurring
function sorter(obj) {
    return Object
        .entries(obj)
        .sort((a, b) => b[1] - a[1])
        .reduce((_sortedObj, [k, v]) => ({
            ..._sortedObj,
            [k]: v
        }), {})
}

//-----------EXTENSIONS-----------

// check if the two resultant word arrays are the same
const isSame = (arr1, arr2) => arr1 === arr2;

// obtain words present in both arrays
const intersection = (arr1, arr2) => Array.from(new Set(arr1.filter(element => arr2.includes(element))));

// obtain only the words present in a single array
const onlyInLeft = (left, right, compareFunction) =>
    left.filter(leftValue =>
        !right.some(rightValue =>
            compareFunction(leftValue, rightValue)));

//return an object containing unique words and non-occurring words
function find(arr1, arr2) {
    const onlyInA = onlyInLeft(arr1, arr2, isSame);
    const onlyInB = onlyInLeft(arr2, arr1, isSame);
    const onlyInBoth = intersection(arr1, arr2);
    const arr1_length = arr1.length;
    const arr2_length = arr2.length;
    const arr3_length = onlyInBoth.length;
    return {
        inA: onlyInA,
        inB: onlyInB,
        inBoth: onlyInBoth,
        array1_len: arr1_length,
        array2_len: arr2_length,
        array3_len: arr3_length
    }
}
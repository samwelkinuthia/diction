const request = require('request');
const unfluff = require('unfluff');
const { removeStopwords } = require('stopword');
const path = require('path');
//testing url
// const url = "https://en.wikipedia.org/wiki/Star_Wars";
const express = require('express');
const cors = require('cors');
const rp = require('request-promise');

const app = express();
// const routes = express.Router();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
//initialize server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


app.post("/count", (req, res) => {
    let url = req.body.url;
    // let url2 = req.body.url2
    request(url, function(error, response, body) {
        let data = unfluff(body)
        //remove special characters
        const text = data.text.replace(/[^a-zA-Z ]/g, "")
        //split the text string into an array
        let temp = removeStop(text)
        const length = temp.split(" ").length;
        const sorted = wordFreq(temp)

        // REMOVE ARTICLES
        const arranged = sorter(sorted)

        //delete blank entries and words with a count of less than 2
        for (const key in arranged) {
            if (key === '') {
                delete arranged[key]
            }
            if (arranged[key] < 2) {
                delete arranged[key]
            }
        }
        // new array to hold word and counts
        const objArr = [];
        Object.keys(arranged).forEach(key => objArr.push({
                word: key,
                count: arranged[key]
            }
        ));
        // console.log(objArr);
        //api response to axios frontend
        res.send({objs:objArr, dist: length});
    });
})

//empty array to hold post:/count2 results
let temp = [];

app.post("/count2", (req, res) => {
    //obtain the two URLs from client side
    let url1 = req.body.url1;
    let url2 = req.body.url2;
    // console.log(url1, url2);
    //chained request promises for each URL
    rp(url1).then((htmlString) => {
        let url1_scrapped = unfluff(htmlString);
        let text = url1_scrapped.text.replace(/[^a-zA-Z ]/g, "")
        let cleaned_text = removeStop(text)
        let array1 = cleaned_text.split(" ")
        temp.push(array1);
    }).then(
        rp(url2).then((htmlString) => {
            let url2_scrapped = unfluff(htmlString);
            let text = url2_scrapped.text.replace(/[^a-zA-Z ]/g, "")
            let cleaned_text = removeStop(text);
            let array2 = cleaned_text.split(" ");
            temp.push(array2);
            let result = find(temp[0], temp[1]);
            res.send(result);
            // console.log(result)
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
function removeStop(text) {//split the text string into an array
    let x  = text.split(" ")
    let y = removeStopwords(x);
    return y.join(" ")
}
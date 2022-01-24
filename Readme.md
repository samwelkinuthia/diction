![alt text](https://img.shields.io/github/license/samwelkinuthia/diction) [![GitHub version](https://badge.fury.io/gh/samwelkinuthia%2Fdiction.svg)](https://badge.fury.io/gh/samwelkinuthia%2Fdiction)

# Diction challenge

Write an application which, when given a web page will download the text on it and output a sorted list of the unique words on the page, with counts of the occurrences.

Extensions.
Consider extending the application to work with a dictionary, or configurable word list, so one can e.g. find the non-English words on the page. Or perhaps provide a way to compare two (or more pages) in terms of words found in both and only in one or the other?


#  About

This web application provides a way to extract and tabulate text from webpages. It provides a sorted list of the most occuring words on a webpage as well as their respective counts. e.g. The word "Star" in [https://en.wikipedia.org/wiki/Star_Wars](https://en.wikipedia.org/wiki/Star_Wars) appears **114** times. The app can also take two URLs and return the following:
  - A list of words unique to each URL.
  - A list of words present in both URLs.

#  Getting Started

- Ensure Node Js is installed on your machine. If not, follow the instructions [here](https://nodejs.org/en/download/).
- Ensure nodemon is installed by running `npm install -g nodemon`.
- Clone this repository using `git clone git@github.com:samwelkinuthia/diction.git
`
- Since this project holds both the client application and the server application, there will be node modules in two different places. Therefore navigate to the client and server folders separately and run `npm install` to install server and client dependencies.
- Run `nodemon server.js` while in the server folder to start the backend server. A *server is running on port 5000* indicates that the server has been started correctly.
- Run `npm start` in the client folder and [https://localhost:3000](https://localhost:3000) will be opened on your browser.

#  Development

This project was built using a Node backend and React frontend. Communication between the web client and server was accomplished using an express API with 2 endpoints `localhost:5000/count` and `localhost:5000/count2`. A POST request to the endpoints is sent when the submit button is pressed on the web app and the response rendered on a table.

### Pre-Requisites
The following tools/libraries were used to develop this project.

**Backend**

- [Node Js](https://github.com/nodejs/node) - Runtime environment for JavaScript.
- [Express](https://github.com/expressjs/express) - Creates server and provides endpoints that serve data to the web client.
- [Request](https://github.com/request/request) and [Request Promise](https://github.com/request/request-promise) - Perform HTTP requests to provided URLs to extract webpage content in the form of HTML.
- [node-unfluff](https://github.com/ageitgey/node-unfluff) - Extracts text data from resultant HTML string produced by `request` into a JSON object.

**Frontend**

- [React](https://github.com/facebook/react) - Used for the web interface that connects to the backend.
- [React-Bootstrap](https://github.com/facebook/react) - Handles general UI including grids, forms, and accordions.
- [Axios](https://github.com/axios/axios) - Makes POST requests to the backend API endpoints enabling data transfer.

###  File Structure

The application is structured as follows:

```
.
├── client
│   ├── public
│   │   ├── index.html
│   ├── src
│       ├── components
│       │   └── Main.js //main application component in charge of rendering the tables
│       │
│       ├── App.css
│       ├── App.Js //renders components
│       └── index.js //entry point for react js app
│       ├── App.test.js
│       └── index.css
│       └── package-lock.json
│       ├── package.json
│       └── .gitignore
|   
├── server
│   ├── server.js //server logic, API calls and defines server side npm packages
│   ├── package-lock.json
│   ├── package.json
|
└── README.md
```

<!-- - `client`- holds client application
  - `public` - holds static files
  - `public` - holds static files
    - `public` - holds static files
    - `public` - holds static files
    - `public` - holds static files
    - `public` - holds static files
    - `public` - holds static files -->


###  How it works

##### 1. HTTP requests
 The `request` and `request-promise` packages obtain html from the provided URLs. The request package was used for the base application as it takes in a single url. The `request-promise (rp)` package was used for the two urls comparison extension. This is because chaining using the `then` command is possible in the form of `rp(url1)..do something...then....rp(url2)... do another thing..`. The output from these HTTP requests is the HTML contained in the input urls. For example, `request('https://www.marxists.org/archive/brecht/works/1935/questions.htm' ...)` produces the sample output below

```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Questions From a Worker Who Reads, Bertolt Brecht 1935</title>
<link rel="stylesheet" type="text/css" href="../../../../css/works-blue.css">
</head>

<body>
<p class="title">
Bertolt Brecht 1935</p>
<h3>Questions From a Worker Who Reads</h3>
<hr width="50%">
......etc

```
##### 2. Obtaining text
 The unfluff library is able to extract text from the HTML string into a standard json object. For the example in (1) above, unfluff produces the JSON below.

```
{
  title: 'Questions From a Worker Who Reads, Bertolt Brecht 1935',
  softTitle: 'Questions From a Worker Who Reads, Bertolt Brecht 1935',
  date: null,
  author: [],
  publisher: null,
  copyright: null,
  favicon: undefined,
  description: undefined,
  text: 'Who built Thebes of the 7 gates ?\n' +
    '\n' +
    'In the books you will read the names of kings.\n' +
```
Therefore, the text can easily be obtained by storing the JSON in a variable *e.g.* `data` and then accessing the text using `data.text`.

##### 3. String manipulation
At this point the text output is a really long string. Regex is utilised to remove special characters and the string is also split into a word array using
`data.text.replace(/[^a-zA-Z ]/g, "").split(" ")`. The number of words is then be obtained by `array.length` method. The `wordFreq(string){...}` function returns an object containing words and their occurrence counts.

```
{
  Who: 1,
  built: 1,
  Thebes: 1,
  of: 7,
  the: 18,
  '': 4,
  .......
}
```
A `sorter(object){...}` function produces the sorted output
```
{
  the: 18,
  of: 7,
  '': 4,
  did: 3,
  ........
}
```
The empty keys are deleted and the object converted into an array of objects. This will enable easier access to looping methods such as `forEach()` and `.map()` as well as making the data uniform *i.e.*
```
[
  { word: 'the', count: 18 },
  { word: 'of', count: 7 },
  { word: 'did', count: 3 },
  { word: 'for', count: 3 },
  { word: 'he', count: 3 },
]
```
This array, together with the total word count, is sent to the React app using the API response method `res.send({array, wordcount})`.

##### 4. Array manipulation

The extensions utilize array manipulation. The text string obtained from `unfluff` is converted into a word array. The two URLs produce two arrays that are used for comparisons.

An `isSame(array1, array2)` method checks if the arrays are similar. If not, the `onlyInLeft()` function outputs an array containing words that are unique to one array. The function is called twice with the `array1` and `array2` parameters switching to obtain two output arrays,one with words unique to array 1 and the other with words unique to array 2.

The `intersection()` function outputs words found in both arrays through the `.filter()`, `.includes()` and the `Set` method.

The resulting 3 arrays are converted into an object and exposed using  `res.send({object})`

<!-- # :rocket: Deployment
Write the deployment instruction here. -->


#  Contribution

Contributions are always welcome. To contribute to this repo, you can:

 1. **Report a bug** <br>
 If you think you have encountered a bug, feel free to open a new [issue](https://github.com/samwelkinuthia/diction/issues) and I will take care of it.

 2. **Create a pull request** <br>
 Pull requests will be appreciated and you can get started by picking up any open [issue](https://github.com/samwelkinuthia/diction/issues) and make a pull request.

# Bugs

- Does not work with non english webpages.
- Can produce errors when the URL provided contains extremely limited text since words with less than 2 occurences are not displayed.

#   Gallery

Resultant output on the web app:

![localhost_3000_(HD) (1)](https://user-images.githubusercontent.com/27720313/150702858-f76204dd-ab99-4545-97f7-b90022189714.png)


#  :lock: License
MIT LICENSE

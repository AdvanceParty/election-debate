const fs = require('fs');
const smQuotes = require('../www-src/lambda/pm.json').quotes;
const bsQuotes = require('../www-src/lambda/shorten.json').quotes;
var vfile = require('to-vfile');
var retext = require('retext');
var keywords = require('retext-keywords');
var toString = require('nlcst-to-string');

const outputPath = './www-src/lambda/keywordData.json';

const extractKeywords = quotes => {
  const obj = {};
  quotes.map((quote, index) => {
    retext()
      .use(keywords)
      .process(quote, (err, file) => {
        if (err) throw err;

        file.data.keywords.map(item => {
          const keyword = toString(item.matches[0].node).toLowerCase();
          if (!obj[keyword]) obj[keyword] = new Array();
          obj[keyword].push(index);
        });
      });
  });

  return Object.keys(obj).reduce((acc, key) => {
    return [...acc, { term: key, lines: obj[key] }];
  }, []);
};

const smKeywords = extractKeywords(smQuotes);
const bsKeywords = extractKeywords(bsQuotes);

const saveKeywordData = (data, fName) => {
  fs.writeFile(fName, data, err => {
    if (err) throw err;
    console.log(`Saved ${fName}`);
  });
};

const data = JSON.stringify({ sm: smKeywords, bs: bsKeywords });
saveKeywordData(data, outputPath);

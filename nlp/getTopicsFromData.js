const fs = require('fs');
const smQuotes = require('../www-src/lambda/pm.json').quotes;
const bsQuotes = require('../www-src/lambda/shorten.json').quotes;
const outputPath = './www-src/lambda/keywordData.json';
var keyword_extractor = require('keyword-extractor');

//  Extract the keywords
const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  return_chained_words: false,
  remove_duplicates: true,
};

const extractKeywords = quotes => {
  const obj = {};
  quotes.map((quote, index) => {
    var keywords = keyword_extractor.extract(quote, options);
    keywords.map(keyword => {
      if (!obj[keyword]) obj[keyword] = new Array();
      obj[keyword].push(index);
    });
  });
  return obj;
};

const saveKeywordData = (data, fName) => {
  fs.writeFile(fName, data, err => {
    if (err) throw err;
    console.log(`Saved ${fName}`);
  });
};

const smKeywords = extractKeywords(smQuotes);
const bsKeywords = extractKeywords(bsQuotes);
const data = JSON.stringify({ sm: smKeywords, bs: bsKeywords });
saveKeywordData(data, outputPath);
